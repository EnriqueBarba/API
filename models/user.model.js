const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;

const COUNTRIES = ['Afghanistan', 'AlandIslands', 'Albania', 'Algeria', 'AmericanSamoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'AntiguaAndBarbuda', 'Argentina', 'Armenia',
  'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan',
  'Bolivia', 'BosniaAndHerzegovina', 'Botswana', 'BouvetIsland', 'Brazil', 'BritishIndianOceanTerritory' , 'BruneiDarussalam' , 'Bulgaria',
  'BurkinaFaso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'CapeVerde', 'CaymanIslands', 'CentralAfricanRepublic', 'Chad', 'Chile', 'China', 'ChristmasIsland',
  'CocosKeelingIslands', 'Colombia', 'Comoros', 'Congo', 'CongoDemocraticRepublic', 'CookIslands', 'CostaRica', 'CoteDIvoire', 'Croatia', 'Cuba', 'Cyprus',
  'CzechRepublic', 'Denmark', 'Djibouti', 'Dominica', 'DominicanRepublic', 'Ecuador', 'Egypt', 'ElSalvador', 'EquatorialGuinea', 'Eritrea', 'Estonia' , 'Ethiopia',
  'FalklandIslands', 'FaroeIslands', 'Fiji', 'Finland', 'France', 'FrenchGuiana', 'FrenchPolynesia', 'FrenchSouthernTerritories', 'Gabon', 'Gambia', 'Georgia',
  'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'GuineaBissau', 'Guyana', 'Haiti',
  'HeardIslandMcdonaldIslands', 'VaticanCityState', 'Honduras', 'HongKong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'IsleOfMan',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan' , 'Kenya', 'Kiribati', 'Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
  'Lesotho', 'Liberia', 'LibyanArabJamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia',  'Maldives',
  'Mali', 'Malta', 'MarshallIslands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro' ,
  'Montserrat', 'Morocco', 'Mozambique',  'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'NetherlandsAntilles', 'NewCaledonia', 'NewZealand', 'Nicaragua',
  'Niger', 'Nigeria', 'Niue', 'NorfolkIsland', 'NorthernMarianaIslands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'PalestinianTerritory', 'Panama', 'PapuaNewGuinea',
  'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'PuertoRico', 'Qatar', 'Reunion', 'Romania', 'RussianFederation', 'Rwanda', 'SaintBarthelemy',
  'SaintHelena', 'SaintKittsAndNevis', 'SaintLucia', 'SaintMartin', 'SaintPierreAndMiquelon', 'SaintVincentAndGrenadines', 'Samoa', 'SanMarino', 'SaoTomeAndPrincipe',
  'SaudiArabia', 'Senegal', 'Serbia', 'Seychelles', 'SierraLeone', 'Singapore', 'Slovakia', 'Slovenia', 'SolomonIslands', 'Somalia', 'SouthAfrica', 'SouthGeorgiaAndSandwichIsl',
  'Spain', 'SriLanka', 'Sudan', 'Suriname', 'SvalbardAndJanMayen', 'Swaziland', 'Sweden', 'Switzerland', 'SyrianArabRepublic', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
  'TimorLeste', 'Togo', 'Tokelau', 'Tonga', 'TrinidadAndTobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'TurksAndCaicosIslands', 'Tuvalu', 'Uganda', 'Ukraine', 'UnitedArabEmirates',
  'UnitedKingdom', 'UnitedStates', 'UnitedStatesOutlyingIslands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'VietNam', 'VirginIslandsBritish', 'VirginIslandsUS',
  'WallisAndFutuna', 'WesternSahara', 'Yemen', 'Zambia', 'Zimbabw']

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
        minlength: [3, 'Full Name needs at last 3 characters'],
        trim: true},
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [EMAIL_PATTERN, 'Email format is invalid']
        },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password needs at last 8 chars']
    },
    address: {
        country:{
            type: String,
            required: [true, 'Specify a valid Country'],
            enum: COUNTRIES
        },
        postalCode:{
            type: String,
            required: [true, 'Provide a postal code']
        },
        street: {
            type: String,
            required: [true, 'Street field can not be empty']
        }
    }
    /*,
    billingDetails: '',
    phoneNumber:'',
    */
},
{
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (db, ret) => {
        ret.id = db._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      }
    }
})

userSchema.pre('save', function (next) {
    const user = this;
      bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
          return bcrypt.hash(user.password, salt)
            .then(hash => {
              user.password = hash;
              next();
            });
        })
        .catch(error => next(error));
  });
  
  userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
  }

  const User = mongoose.model('User', userSchema);

module.exports = User;