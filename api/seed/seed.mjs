#!/usr/bin/env node
/**
 * IronGrip — idempotent Saleor seed.
 *
 * Creates (only if missing): UK warehouse, `uk` channel (GBP, VAT-inclusive), UK shipping zone,
 * GB 20% VAT, glove attributes, "Disposable gloves" product type, and four categories.
 * Safe to re-run.
 *
 * Usage:
 *   SALEOR_API_URL=http://localhost:8000/graphql/ \
 *   SALEOR_ADMIN_EMAIL=admin@irongrip.uk SALEOR_ADMIN_PASSWORD=... node api/seed/seed.mjs
 */

const API = process.env.SALEOR_API_URL ?? "http://localhost:8000/graphql/";
const EMAIL = process.env.SALEOR_ADMIN_EMAIL;
const PASSWORD = process.env.SALEOR_ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
	console.error("Set SALEOR_ADMIN_EMAIL and SALEOR_ADMIN_PASSWORD.");
	process.exit(1);
}

let token = "";

async function gql(query, variables = {}) {
	const res = await fetch(API, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			...(token ? { authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify({ query, variables }),
	});
	const json = await res.json();
	if (json.errors?.length) {
		throw new Error(json.errors.map((e) => e.message).join("; "));
	}
	return json.data;
}

function assertNoErrors(payload, label) {
	const errors = payload?.errors ?? [];
	if (errors.length) {
		throw new Error(`${label}: ${errors.map((e) => `${e.field ?? ""} ${e.code ?? ""} ${e.message ?? ""}`).join("; ")}`);
	}
}

const log = (msg) => console.log(`• ${msg}`);

async function login() {
	const data = await gql(
		`mutation($email: String!, $password: String!) { tokenCreate(email: $email, password: $password) { token errors { field message } } }`,
		{ email: EMAIL, password: PASSWORD },
	);
	assertNoErrors(data.tokenCreate, "tokenCreate");
	token = data.tokenCreate.token;
	log("Logged in");
}

async function ensureShopName() {
	const data = await gql(
		`mutation { shopSettingsUpdate(input: { headerText: "IronGrip", description: "Premium gloves for UK trades and businesses." }) { errors { field message } } }`,
	);
	assertNoErrors(data.shopSettingsUpdate, "shopSettingsUpdate");
	const domain = await gql(`mutation { shopDomainUpdate(input: { name: "IronGrip" }) { errors { field message } } }`).catch(
		() => null,
	);
	if (domain) assertNoErrors(domain.shopDomainUpdate, "shopDomainUpdate");
	log("Shop name set to IronGrip");
}

async function ensureWarehouse() {
	const found = await gql(`{ warehouses(first: 100) { edges { node { id slug } } } }`);
	const existing = found.warehouses.edges.find((e) => e.node.slug === "uk-warehouse");
	if (existing) {
		log("Warehouse exists");
		return existing.node.id;
	}
	const data = await gql(
		`mutation($input: WarehouseCreateInput!) { createWarehouse(input: $input) { warehouse { id } errors { field message code } } }`,
		{
			input: {
				name: "UK Warehouse",
				slug: "uk-warehouse",
				email: "hello@irongrip.uk",
				address: {
					streetAddress1: "TBC — update after incorporation",
					city: "London",
					postalCode: "EC1A 1BB",
					country: "GB",
				},
			},
		},
	);
	assertNoErrors(data.createWarehouse, "createWarehouse");
	log("Warehouse created");
	return data.createWarehouse.warehouse.id;
}

async function ensureChannel(warehouseId) {
	const found = await gql(`{ channels { id slug } }`);
	const existing = found.channels.find((c) => c.slug === "uk");
	if (existing) {
		log("Channel uk exists");
		return existing.id;
	}
	const data = await gql(
		`mutation($input: ChannelCreateInput!) { channelCreate(input: $input) { channel { id } errors { field message code } } }`,
		{
			input: {
				name: "United Kingdom",
				slug: "uk",
				currencyCode: "GBP",
				defaultCountry: "GB",
				isActive: true,
				addWarehouses: [warehouseId],
			},
		},
	);
	assertNoErrors(data.channelCreate, "channelCreate");
	log("Channel uk created (GBP, GB)");
	return data.channelCreate.channel.id;
}

async function ensureTax(channelId) {
	const configs = await gql(`{ taxConfigurations(first: 20) { edges { node { id channel { slug } } } } }`);
	const cfg = configs.taxConfigurations.edges.find((e) => e.node.channel.slug === "uk");
	if (cfg) {
		const data = await gql(
			`mutation($id: ID!) { taxConfigurationUpdate(id: $id, input: { chargeTaxes: true, pricesEnteredWithTax: true, displayGrossPrices: true, taxCalculationStrategy: FLAT_RATES }) { errors { field message } } }`,
			{ id: cfg.node.id },
		);
		assertNoErrors(data.taxConfigurationUpdate, "taxConfigurationUpdate");
	}
	const rate = await gql(
		`mutation { taxCountryConfigurationUpdate(countryCode: GB, updateTaxClassRates: [{ rate: 20 }]) { errors { field message } } }`,
	);
	assertNoErrors(rate.taxCountryConfigurationUpdate, "taxCountryConfigurationUpdate");
	log("Tax: prices include VAT, GB default rate 20%");
	void channelId;
}

async function ensureShippingZone(channelId, warehouseId) {
	const found = await gql(`{ shippingZones(first: 50) { edges { node { id name } } } }`);
	if (found.shippingZones.edges.some((e) => e.node.name === "United Kingdom")) {
		log("Shipping zone exists");
		return;
	}
	const data = await gql(
		`mutation($input: ShippingZoneCreateInput!) { shippingZoneCreate(input: $input) { shippingZone { id } errors { field message code } } }`,
		{
			input: {
				name: "United Kingdom",
				description: "UK mainland — rates TBC before launch",
				countries: ["GB"],
				addWarehouses: [warehouseId],
				addChannels: [channelId],
			},
		},
	);
	assertNoErrors(data.shippingZoneCreate, "shippingZoneCreate");
	log("Shipping zone United Kingdom created (add rates in Dashboard before selling)");
}

const ATTRIBUTES = [
	{ slug: "glove-material", name: "Material", inputType: "DROPDOWN", values: ["Nitrile", "Vinyl", "Latex", "Polyethylene"] },
	{ slug: "glove-colour", name: "Colour", inputType: "DROPDOWN", values: ["Black", "Blue", "Orange", "Green", "Pink", "White", "Purple", "Clear"] },
	{ slug: "thickness-finger-mm", name: "Thickness at finger (mm)", inputType: "NUMERIC", unit: "MM" },
	{ slug: "thickness-palm-mm", name: "Thickness at palm (mm)", inputType: "NUMERIC", unit: "MM" },
	{ slug: "glove-texture", name: "Texture", inputType: "DROPDOWN", values: ["Diamond textured", "Finger textured", "Fully textured", "Smooth"] },
	{ slug: "pack-quantity", name: "Gloves per box", inputType: "NUMERIC" },
	{ slug: "cuff-length-mm", name: "Cuff length (mm)", inputType: "NUMERIC", unit: "MM" },
	{ slug: "powder-free", name: "Powder-free", inputType: "BOOLEAN" },
	{ slug: "glove-standards", name: "Standards", inputType: "MULTISELECT", values: ["EN ISO 21420", "EN ISO 374-1", "EN ISO 374-5", "EN 455", "Food contact"] },
	{ slug: "aql", name: "AQL", inputType: "PLAIN_TEXT" },
	{ slug: "duty-level", name: "Duty level", inputType: "DROPDOWN", values: ["Light", "Medium", "Heavy"] },
];

const SIZE_ATTRIBUTE = { slug: "glove-size", name: "Size", inputType: "DROPDOWN", values: ["XS", "S", "M", "L", "XL", "XXL"] };

async function ensureAttribute(def) {
	const found = await gql(`query($slug: String!) { attribute(slug: $slug) { id } }`, { slug: def.slug });
	if (found.attribute) return found.attribute.id;
	const input = {
		name: def.name,
		slug: def.slug,
		type: "PRODUCT_TYPE",
		inputType: def.inputType,
		valueRequired: false,
		visibleInStorefront: true,
		filterableInStorefront: ["DROPDOWN", "MULTISELECT", "BOOLEAN"].includes(def.inputType),
		...(def.unit ? { unit: def.unit } : {}),
		...(def.values ? { values: def.values.map((name) => ({ name })) } : {}),
	};
	const data = await gql(
		`mutation($input: AttributeCreateInput!) { attributeCreate(input: $input) { attribute { id } errors { field message code } } }`,
		{ input },
	);
	assertNoErrors(data.attributeCreate, `attributeCreate ${def.slug}`);
	log(`Attribute ${def.name} created`);
	return data.attributeCreate.attribute.id;
}

async function ensureProductType(productAttributeIds, sizeAttributeId) {
	const found = await gql(`{ productTypes(first: 100) { edges { node { id slug } } } }`);
	const existing = found.productTypes.edges.find((e) => e.node.slug === "disposable-gloves");
	if (existing) {
		log("Product type exists");
		return;
	}
	const data = await gql(
		`mutation($input: ProductTypeInput!) { productTypeCreate(input: $input) { productType { id } errors { field message code } } }`,
		{
			input: {
				name: "Disposable gloves",
				slug: "disposable-gloves",
				kind: "NORMAL",
				hasVariants: true,
				isShippingRequired: true,
				productAttributes: productAttributeIds,
			},
		},
	);
	assertNoErrors(data.productTypeCreate, "productTypeCreate");
	const productTypeId = data.productTypeCreate.productType.id;
	const assign = await gql(
		`mutation($id: ID!, $ops: [ProductAttributeAssignInput!]!) { productAttributeAssign(productTypeId: $id, operations: $ops) { errors { field message code } } }`,
		{ id: productTypeId, ops: [{ id: sizeAttributeId, type: "VARIANT", variantSelection: true }] },
	);
	assertNoErrors(assign.productAttributeAssign, "productAttributeAssign");
	log("Product type Disposable gloves created (variants by size)");
}

const CATEGORIES = [
	{ slug: "heavy-duty", name: "Heavy duty", description: "Thicker, textured nitrile for oil, grease and tough tasks." },
	{ slug: "everyday", name: "Everyday", description: "Powder-free nitrile for daily use across trades, salons and the home." },
	{ slug: "chemical-resistant", name: "Chemical resistant", description: "Nitrile gloves tested for protection against specific chemicals." },
	{ slug: "food-safe", name: "Food safe", description: "Gloves suitable for handling food, with food-contact declarations." },
];

function editorJs(text) {
	return JSON.stringify({ time: Date.now(), blocks: [{ type: "paragraph", data: { text } }], version: "2.24.3" });
}

async function ensureCategories() {
	for (const cat of CATEGORIES) {
		const found = await gql(`query($slug: String!) { category(slug: $slug) { id } }`, { slug: cat.slug });
		if (found.category) continue;
		const data = await gql(
			`mutation($input: CategoryInput!) { categoryCreate(input: $input) { category { id } errors { field message code } } }`,
			{ input: { name: cat.name, slug: cat.slug, description: editorJs(cat.description) } },
		);
		assertNoErrors(data.categoryCreate, `categoryCreate ${cat.slug}`);
		log(`Category ${cat.name} created`);
	}
}

async function main() {
	console.log(`Seeding ${API}`);
	await login();
	await ensureShopName();
	const warehouseId = await ensureWarehouse();
	const channelId = await ensureChannel(warehouseId);
	await ensureTax(channelId);
	await ensureShippingZone(channelId, warehouseId);
	const productAttributeIds = [];
	for (const def of ATTRIBUTES) productAttributeIds.push(await ensureAttribute(def));
	const sizeId = await ensureAttribute(SIZE_ATTRIBUTE);
	await ensureProductType(productAttributeIds, sizeId);
	await ensureCategories();
	console.log("Done.");
}

main().catch((err) => {
	console.error(err.message ?? err);
	process.exit(1);
});
