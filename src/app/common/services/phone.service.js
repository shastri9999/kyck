'use strict';


class PhoneService{
	constructor($http) {
		'ngInject';
		this._$http = $http;
		this.phoneExtensions = [
		{
			"country":"Guam",
			"ext":"+1671",
			"code":"gu"
		},
		{
			"country":"Guatemala",
			"ext":"+502",
			"code":"gt"
		},
		{
			"country":"Greece",
			"ext":"+30",
			"code":"gr"
		},
		{
			"country":"Equatorial Guinea",
			"ext":"+240",
			"code":"gq"
		},
		{
			"country":"Guadeloupe",
			"ext":"+590",
			"code":"gp"
		},
		{
			"country":"Guyana",
			"ext":"+592",
			"code":"gy"
		},
		{
			"country":"French Guiana",
			"ext":"+594",
			"code":"gf"
		},
		{
			"country":"Georgia",
			"ext":"+995",
			"code":"ge"
		},
		{
			"country":"Grenada",
			"ext":"+1473",
			"code":"gd"
		},
		{
			"country":"United Kingdom",
			"ext":"+44",
			"code":"gb"
		},
		{
			"country":"Gabon",
			"ext":"+241",
			"code":"ga"
		},
		{
			"country":"Guinea",
			"ext":"+224",
			"code":"gn"
		},
		{
			"country":"Gambia",
			"ext":"+220",
			"code":"gm"
		},
		{
			"country":"Greenland",
			"ext":"+299",
			"code":"gl"
		},
		{
			"country":"Gibraltar",
			"ext":"+350",
			"code":"gi"
		},
		{
			"country":"Ghana",
			"ext":"+233",
			"code":"gh"
		},
		{
			"country":"Tanzania",
			"ext":"+255",
			"code":"tz"
		},
		{
			"country":"Taiwan",
			"ext":"+886",
			"code":"tw"
		},
		{
			"country":"Trinidad and Tobago",
			"ext":"+1868",
			"code":"tt"
		},
		{
			"country":"Turkey",
			"ext":"+90",
			"code":"tr"
		},
		{
			"country":"Tunisia",
			"ext":"+216",
			"code":"tn"
		},
		{
			"country":"Tonga",
			"ext":"+676",
			"code":"to"
		},
		{
			"country":"Tajikistan",
			"ext":"+992",
			"code":"tj"
		},
		{
			"country":"Thailand",
			"ext":"+66",
			"code":"th"
		},
		{
			"country":"Togo",
			"ext":"+228",
			"code":"tg"
		},
		{
			"country":"Chad",
			"ext":"+235",
			"code":"td"
		},
		{
			"country":"Turks and Caicos Islands",
			"ext":"+1649",
			"code":"tc"
		},
		{
			"country":"Dominican Republic",
			"ext":"+1809",
			"code":"do"
		},
		{
			"country":"Dominica",
			"ext":"+1767",
			"code":"dm"
		},
		{
			"country":"Djibouti",
			"ext":"+253",
			"code":"dj"
		},
		{
			"country":"Denmark",
			"ext":"+45",
			"code":"dk"
		},
		{
			"country":"Germany",
			"ext":"+49",
			"code":"de"
		},
		{
			"country":"Algeria",
			"ext":"+213",
			"code":"dz"
		},
		{
			"country":"Qatar",
			"ext":"+974",
			"code":"qa"
		},
		{
			"country":"Zambia",
			"ext":"+260",
			"code":"zm"
		},
		{
			"country":"South Africa",
			"ext":"+27",
			"code":"za"
		},
		{
			"country":"Zimbabwe",
			"ext":"+263",
			"code":"zw"
		},
		{
			"country":"Japan",
			"ext":"+81",
			"code":"jp"
		},
		{
			"country":"Jamaica",
			"ext":"+1876",
			"code":"jm"
		},
		{
			"country":"Jordan",
			"ext":"+962",
			"code":"jo"
		},
		{
			"country":"Samoa",
			"ext":"+685",
			"code":"ws"
		},
		{
			"country":"Switzerland",
			"ext":"+41",
			"code":"ch"
		},
		{
			"country":"Colombia",
			"ext":"+57",
			"code":"co"
		},
		{
			"country":"China",
			"ext":"+86",
			"code":"cn"
		},
		{
			"country":"Cameroon",
			"ext":"+237",
			"code":"cm"
		},
		{
			"country":"Chile",
			"ext":"+56",
			"code":"cl"
		},
		{
			"country":"Canada",
			"ext":"+1",
			"code":"ca"
		},
		{
			"country":"Congo",
			"ext":"+242",
			"code":"cg"
		},
		{
			"country":"Central Africa",
			"ext":"+236",
			"code":"cf"
		},
		{
			"country":"Congo, Dem Rep",
			"ext":"+243",
			"code":"cd"
		},
		{
			"country":"Czech Republic",
			"ext":"+420",
			"code":"cz"
		},
		{
			"country":"Cyprus",
			"ext":"+357",
			"code":"cy"
		},
		{
			"country":"Costa Rica",
			"ext":"+506",
			"code":"cr"
		},
		{
			"country":"Cape Verde",
			"ext":"+238",
			"code":"cv"
		},
		{
			"country":"Puerto Rico",
			"ext":"+1",
			"code":"pr"
		},
		{
			"country":"Palestinian Territory",
			"ext":"+970",
			"code":"ps"
		},
		{
			"country":"Portugal",
			"ext":"+351",
			"code":"pt"
		},
		{
			"country":"Paraguay",
			"ext":"+595",
			"code":"py"
		},
		{
			"country":"Panama",
			"ext":"+507",
			"code":"pa"
		},
		{
			"country":"French Polynesia",
			"ext":"+689",
			"code":"pf"
		},
		{
			"country":"Peru",
			"ext":"+51",
			"code":"pe"
		},
		{
			"country":"Pakistan",
			"ext":"+92",
			"code":"pk"
		},
		{
			"country":"Philippines",
			"ext":"+63",
			"code":"ph"
		},
		{
			"country":"Poland",
			"ext":"+48",
			"code":"pl"
		},
		{
			"country":"Montenegro",
			"ext":"+382",
			"code":"me"
		},
		{
			"country":"Madagascar",
			"ext":"+261",
			"code":"mg"
		},
		{
			"country":"Morocco/Western Sahara",
			"ext":"+212",
			"code":"ma"
		},
		{
			"country":"Monaco",
			"ext":"+377",
			"code":"mc"
		},
		{
			"country":"Mali",
			"ext":"+223",
			"code":"ml"
		},
		{
			"country":"Macao",
			"ext":"+853",
			"code":"mo"
		},
		{
			"country":"Mongolia",
			"ext":"+976",
			"code":"mn"
		},
		{
			"country":"Macedonia",
			"ext":"+389",
			"code":"mk"
		},
		{
			"country":"Mauritius",
			"ext":"+230",
			"code":"mu"
		},
		{
			"country":"Malta",
			"ext":"+356",
			"code":"mt"
		},
		{
			"country":"Malawi",
			"ext":"+265",
			"code":"mw"
		},
		{
			"country":"Maldives",
			"ext":"+960",
			"code":"mv"
		},
		{
			"country":"Martinique",
			"ext":"+596",
			"code":"mq"
		},
		{
			"country":"Montserrat",
			"ext":"+1664",
			"code":"ms"
		},
		{
			"country":"Mauritania",
			"ext":"+222",
			"code":"mr"
		},
		{
			"country":"Malaysia",
			"ext":"+60",
			"code":"my"
		},
		{
			"country":"Mexico",
			"ext":"+52",
			"code":"mx"
		},
		{
			"country":"Mozambique",
			"ext":"+258",
			"code":"mz"
		},
		{
			"country":"St Vincent Grenadines",
			"ext":"+1784",
			"code":"vc"
		},
		{
			"country":"Venezuela",
			"ext":"+58",
			"code":"ve"
		},
		{
			"country":"Virgin Islands, British",
			"ext":"+1284",
			"code":"vg"
		},
		{
			"country":"Iraq",
			"ext":"+964",
			"code":"iq"
		},
		{
			"country":"Virgin Islands, U.S.",
			"ext":"+1340",
			"code":"vi"
		},
		{
			"country":"Iceland",
			"ext":"+354",
			"code":"is"
		},
		{
			"country":"Iran",
			"ext":"+98",
			"code":"ir"
		},
		{
			"country":"Italy",
			"ext":"+39",
			"code":"it"
		},
		{
			"country":"Vietnam",
			"ext":"+84",
			"code":"vn"
		},
		{
			"country":"Israel",
			"ext":"+972",
			"code":"il"
		},
		{
			"country":"India",
			"ext":"+91",
			"code":"in"
		},
		{
			"country":"Ireland",
			"ext":"+353",
			"code":"ie"
		},
		{
			"country":"Indonesia",
			"ext":"+62",
			"code":"id"
		},
		{
			"country":"France",
			"ext":"+33",
			"code":"fr"
		},
		{
			"country":"Finland/Aland Islands",
			"ext":"+358",
			"code":"fi"
		},
		{
			"country":"Fiji",
			"ext":"+679",
			"code":"fj"
		},
		{
			"country":"Faroe Islands",
			"ext":"+298",
			"code":"fo"
		},
		{
			"country":"Swaziland",
			"ext":"+268",
			"code":"sz"
		},
		{
			"country":"Syria",
			"ext":"+963",
			"code":"sy"
		},
		{
			"country":"Suriname",
			"ext":"+597",
			"code":"sr"
		},
		{
			"country":"El Salvador",
			"ext":"+503",
			"code":"sv"
		},
		{
			"country":"Slovakia",
			"ext":"+421",
			"code":"sk"
		},
		{
			"country":"Slovenia",
			"ext":"+386",
			"code":"si"
		},
		{
			"country":"Senegal",
			"ext":"+221",
			"code":"sn"
		},
		{
			"country":"San Marino",
			"ext":"+378",
			"code":"sm"
		},
		{
			"country":"Sierra Leone",
			"ext":"+232",
			"code":"sl"
		},
		{
			"country":"Seychelles",
			"ext":"+248",
			"code":"sc"
		},
		{
			"country":"Saudi Arabia",
			"ext":"+966",
			"code":"sa"
		},
		{
			"country":"Singapore",
			"ext":"+65",
			"code":"sg"
		},
		{
			"country":"Sweden",
			"ext":"+46",
			"code":"se"
		},
		{
			"country":"Sudan",
			"ext":"+249",
			"code":"sd"
		},
		{
			"country":"Lebanon",
			"ext":"+961",
			"code":"lb"
		},
		{
			"country":"St Lucia",
			"ext":"+1758",
			"code":"lc"
		},
		{
			"country":"Laos",
			"ext":"+856",
			"code":"la"
		},
		{
			"country":"Sri Lanka",
			"ext":"+94",
			"code":"lk"
		},
		{
			"country":"Liechtenstein",
			"ext":"+423",
			"code":"li"
		},
		{
			"country":"Latvia",
			"ext":"+371",
			"code":"lv"
		},
		{
			"country":"Lithuania",
			"ext":"+370",
			"code":"lt"
		},
		{
			"country":"Luxembourg",
			"ext":"+352",
			"code":"lu"
		},
		{
			"country":"Liberia",
			"ext":"+231",
			"code":"lr"
		},
		{
			"country":"Lesotho",
			"ext":"+266",
			"code":"ls"
		},
		{
			"country":"Libya",
			"ext":"+218",
			"code":"ly"
		},
		{
			"country":"Yemen",
			"ext":"+967",
			"code":"ye"
		},
		{
			"country":"Estonia",
			"ext":"+372",
			"code":"ee"
		},
		{
			"country":"Egypt",
			"ext":"+20",
			"code":"eg"
		},
		{
			"country":"Ethiopia",
			"ext":"+251",
			"code":"et"
		},
		{
			"country":"Spain",
			"ext":"+34",
			"code":"es"
		},
		{
			"country":"Russia/Kazakhstan",
			"ext":"+7",
			"code":"ru"
		},
		{
			"country":"Rwanda",
			"ext":"+250",
			"code":"rw"
		},
		{
			"country":"Serbia",
			"ext":"+381",
			"code":"rs"
		},
		{
			"country":"Reunion/Mayotte",
			"ext":"+262",
			"code":"re"
		},
		{
			"country":"Romania",
			"ext":"+40",
			"code":"ro"
		},
		{
			"country":"Bangladesh",
			"ext":"+880",
			"code":"bd"
		},
		{
			"country":"Belgium",
			"ext":"+32",
			"code":"be"
		},
		{
			"country":"Burkina Faso",
			"ext":"+226",
			"code":"bf"
		},
		{
			"country":"Bulgaria",
			"ext":"+359",
			"code":"bg"
		},
		{
			"country":"Bosnia and Herzegovina",
			"ext":"+387",
			"code":"ba"
		},
		{
			"country":"Barbados",
			"ext":"+1246",
			"code":"bb"
		},
		{
			"country":"Bermuda",
			"ext":"+1441",
			"code":"bm"
		},
		{
			"country":"Brunei",
			"ext":"+673",
			"code":"bn"
		},
		{
			"country":"Bolivia",
			"ext":"+591",
			"code":"bo"
		},
		{
			"country":"Bahrain",
			"ext":"+973",
			"code":"bh"
		},
		{
			"country":"Burundi",
			"ext":"+257",
			"code":"bi"
		},
		{
			"country":"Benin",
			"ext":"+229",
			"code":"bj"
		},
		{
			"country":"Botswana",
			"ext":"+267",
			"code":"bw"
		},
		{
			"country":"Brazil",
			"ext":"+55",
			"code":"br"
		},
		{
			"country":"Bahamas",
			"ext":"+1",
			"code":"bs"
		},
		{
			"country":"Belarus",
			"ext":"+375",
			"code":"by"
		},
		{
			"country":"Belize",
			"ext":"+501",
			"code":"bz"
		},
		{
			"country":"Oman",
			"ext":"+968",
			"code":"om"
		},
		{
			"country":"Croatia",
			"ext":"+385",
			"code":"hr"
		},
		{
			"country":"Haiti",
			"ext":"+509",
			"code":"ht"
		},
		{
			"country":"Hungary",
			"ext":"+36",
			"code":"hu"
		},
		{
			"country":"Hong Kong",
			"ext":"+852",
			"code":"hk"
		},
		{
			"country":"Honduras",
			"ext":"+504",
			"code":"hn"
		},
		{
			"country":"Uruguay",
			"ext":"+598",
			"code":"uy"
		},
		{
			"country":"Uzbekistan",
			"ext":"+998",
			"code":"uz"
		},
		{
			"country":"United States",
			"ext":"+1",
			"code":"us"
		},
		{
			"country":"Uganda",
			"ext":"+256",
			"code":"ug"
		},
		{
			"country":"Ukraine",
			"ext":"+380",
			"code":"ua"
		},
		{
			"country":"United Arab Emirates",
			"ext":"+971",
			"code":"ae"
		},
		{
			"country":"Andorra",
			"ext":"+376",
			"code":"ad"
		},
		{
			"country":"Antigua and Barbuda",
			"ext":"+1268",
			"code":"ag"
		},
		{
			"country":"Afghanistan",
			"ext":"+93",
			"code":"af"
		},
		{
			"country":"Anguilla",
			"ext":"+1264",
			"code":"ai"
		},
		{
			"country":"Armenia",
			"ext":"+374",
			"code":"am"
		},
		{
			"country":"Albania",
			"ext":"+355",
			"code":"al"
		},
		{
			"country":"Angola",
			"ext":"+244",
			"code":"ao"
		},
		{
			"country":"American Samoa",
			"ext":"+1684",
			"code":"as"
		},
		{
			"country":"Argentina",
			"ext":"+54",
			"code":"ar"
		},
		{
			"country":"Australia/Cocos/Christmas Island",
			"ext":"+61",
			"code":"au"
		},
		{
			"country":"Austria",
			"ext":"+43",
			"code":"at"
		},
		{
			"country":"Aruba",
			"ext":"+297",
			"code":"aw"
		},
		{
			"country":"Azerbaijan",
			"ext":"+994",
			"code":"az"
		},
		{
			"country":"Nicaragua",
			"ext":"+505",
			"code":"ni"
		},
		{
			"country":"Netherlands",
			"ext":"+31",
			"code":"nl"
		},
		{
			"country":"Norway",
			"ext":"+47",
			"code":"no"
		},
		{
			"country":"Namibia",
			"ext":"+264",
			"code":"na"
		},
		{
			"country":"Niger",
			"ext":"+227",
			"code":"ne"
		},
		{
			"country":"Nigeria",
			"ext":"+234",
			"code":"ng"
		},
		{
			"country":"New Zealand",
			"ext":"+64",
			"code":"nz"
		},
		{
			"country":"Nepal",
			"ext":"+977",
			"code":"np"
		},
		{
			"country":"Kyrgyzstan",
			"ext":"+996",
			"code":"kg"
		},
		{
			"country":"Kenya",
			"ext":"+254",
			"code":"ke"
		},
		{
			"country":"Cambodia",
			"ext":"+855",
			"code":"kh"
		},
		{
			"country":"St Kitts and Nevis",
			"ext":"+1869",
			"code":"kn"
		},
		{
			"country":"Comoros",
			"ext":"+269",
			"code":"km"
		},
		{
			"country":"Korea, Republic of",
			"ext":"+82",
			"code":"kr"
		},
		{
			"country":"Kuwait",
			"ext":"+965",
			"code":"kw"
		},
		{
			"country":"Cayman Islands",
			"ext":"+1345",
			"code":"ky"
		}
		];
		this.selectedExtension = this.phoneExtensions[0];
	}
}

export default PhoneService;