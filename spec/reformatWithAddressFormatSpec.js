describe("The basic form", function () {
	var liveaddress;
	var testResponses = [
		[
			{
				"input_id": "0",
				"address1": "Avenida Atlântica, 974",
				"address2": "Copa",
				"address3": "Rio De Janeiro - RJ",
				"address4": "22010-000",
				"components": {
					"administrative_area": "RJ",
					"country_iso_3": "BRA", "locality": "Rio De Janeiro",
					"dependent_locality": "Copa",
					"postal_code": "22010-000",
					"postal_code_short": "22010-000",
					"premise": "974", "premise_number": "974",
					"thoroughfare": "Avenida Atlântica",
					"thoroughfare_name": "Atlantica",
					"thoroughfare_type": "Av"
				},
				"metadata": {
					"address_format": "thoroughfare, premise|dependent_locality|locality - administrative_area|postal_code"
				},
				"analysis": {
					"verification_status": "Verified",
					"address_precision": "Premise",
					"max_address_precision": "DeliveryPoint"
				}
			}
		],
		[
			{
				"input_id": "0",
				"address1": "Rua Padre Antônio D\'ângelo, 121",
				"address2": "Casa Verde",
				"address3": "São Paulo - SP",
				"address4": "02516-040",
				"components": {
					"administrative_area": "SP",
					"country_iso_3": "BRA",
					"locality": "São Paulo",
					"dependent_locality": "Casa Verde",
					"postal_code": "02516-040",
					"postal_code_short": "02516-040",
					"premise": "121", "premise_number": "121",
					"thoroughfare": "Rua Padre Antônio D\'ângelo",
					"thoroughfare_name": "Padre Antônio D\'ângelo",
					"thoroughfare_type": "Rua"
				},
				"metadata": {
					"address_format": "thoroughfare, premise|dependent_locality|locality - administrative_area|postal_code"
				},
				"analysis": {
					"verification_status": "Verified",
					"address_precision": "Premise",
					"max_address_precision": "DeliveryPoint"
				}
			}
		],
		[
			{
				"address1": "3214 N University Ave # 409",
				"address2": "Provo UT 84604-4405",
				"components": {
					"administrative_area": "UT",
					"sub_administrative_area": "Utah",
					"country_iso_3": "USA",
					"locality": "Provo",
					"postal_code": "846044405",
					"postal_code_short": "84604",
					"postal_code_extra": "4405",
					"premise": "3214",
					"premise_number": "3214",
					"thoroughfare": "N University Ave",
					"thoroughfare_name": "University",
					"thoroughfare_predirection": "N",
					"thoroughfare_type": "Ave",
					"thoroughfare_trailing_type": "Ave",
					"sub_building": "# 409",
					"sub_building_type": "#",
					"sub_building_number": "409"
				},
				"metadata": {},
				"analysis": {"verification_status": "Verified", "address_precision": "Premise"}
			}
		]
	];

	insertBasicForm();

	beforeEach(function () {
		liveaddress = initPlugin();
	});

	afterEach(function () {
		liveaddress.deactivate();
		fillInAddress(0);
	});

	function setupAjaxSpy(testNumber) {
		spyOn($, "ajax").and.callFake(function () {
			var d = $.Deferred();
			d.resolve(testResponses[testNumber - 1]);
			return d.promise();
		});
	}

	it("should fill in the address properly (test 1)", function (done) {
		// Dumb callback because setting up the plugin is asynchronous
		setTimeout(function () {
			setupAjaxSpy(1);

			liveaddress.on("Completed", function (event, data, previousHandler) {
				expect($("#address1").val()).toBe("Avenida Atlântica, 974");
				expect($("#address2").val()).toBe("Copa");
				expect($("#address3").val()).toBe("-");
				expect($("#address4").val()).toBe("");
				previousHandler(event, data);
				done();
			});

			fillInAddress(1);
		}, 10);
	});

	it("should fill in the address properly (test 2)", function (done) {
		setTimeout(function () {
			setupAjaxSpy(2);

			liveaddress.on("Completed", function (event, data, previousHandler) {
				expect($("#address1").val()).toBe("Rua Padre Antônio D'ângelo, 121");
				expect($("#address2").val()).toBe("Casa Verde");
				expect($("#address3").val()).toBe("-");
				expect($("#address4").val()).toBe("");
				previousHandler(event, data);
				done();
			});

			fillInAddress(2);
		}, 10);
	});

	it("should fill in the US address properly (test 3)", function (done) {
		setTimeout(function () {
			setupAjaxSpy(3);

			liveaddress.on("Completed", function (event, data, previousHandler) {
				expect($("#address1").val()).toBe("3214 N University Ave # 409");
				expect($("#address2").val()).toBe("");
				expect($("#address3").val()).toBe("");
				expect($("#address4").val()).toBe("");
				previousHandler(event, data);
				done();
			});

			fillInAddress(3);
		}, 10);
	});
});

function insertBasicForm() {
	document.body.insertAdjacentHTML("afterbegin", "<form><input id='address1'><input id='address2'><input id='address3'><input id='address4'><input id='locality'><input id='administrative_area'><input id='postal_code'><input id='country'></form>");
}

function initPlugin() {
	return $.LiveAddress({
		key: "testing",
		target: "INTERNATIONAL",
		verifySecondary: true,
		addresses: [{
			address1: '#address1',
			address2: '#address2',
			address3: '#address3',
			address4: '#address4',
			locality: '#locality',
			administrative_area: '#administrative_area',
			postal_code: '#postal_code',
			country: '#country'
		}]
	});
}

function fillInAddress(testNumber) {
	var testAddresses = [
		{
			address1: "",
			address2: "",
			address3: "",
			address4: "",
			locality: "",
			administrative_area: "",
			postal_code: "",
			country: ""
		},
		{
			address1: "Av Atlantica 974 - Leme",
			address2: "",
			address3: "",
			address4: "",
			locality: "Rio de Janiero",
			administrative_area: "RJ",
			postal_code: "22010-000",
			country: "Brazil"
		}, {
			address1: "R. Padre Antônio D'Ângelo, 121 - Casa Verde",
			address2: "",
			address3: "",
			address4: "",
			locality: "São Paulo",
			administrative_area: "SP",
			postal_code: "02516-040",
			country: "Brazil"
		}, {
			address1: "3214 N University Ave # 409",
			address2: "",
			address3: "",
			address4: "",
			locality: "Provo",
			administrative_area: "UT",
			postal_code: "",
			country: "USA"
		}
	];

	for (var addressComponent in testAddresses[testNumber]) {
		$("#" + addressComponent).val(testAddresses[testNumber][addressComponent]).change();
	}
}

