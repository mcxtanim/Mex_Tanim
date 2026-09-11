export interface UpazilaData {
  id: string;
  nameEn: string;
  nameBn: string;
}

export interface DistrictData {
  id: string;
  nameEn: string;
  nameBn: string;
  upazilas: UpazilaData[];
}

export interface DivisionData {
  id: string;
  nameEn: string;
  nameBn: string;
  districts: DistrictData[];
}

export const BANGLADESH_ADDRESS_DATA: DivisionData[] = [
  // 1. DHAKA DIVISION
  {
    id: 'dhaka',
    nameEn: 'Dhaka',
    nameBn: 'ঢাকা',
    districts: [
      {
        id: 'dhaka-dist',
        nameEn: 'Dhaka',
        nameBn: 'ঢাকা',
        upazilas: [
          { id: 'dhanmondi', nameEn: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
          { id: 'mirpur', nameEn: 'Mirpur', nameBn: 'মিরপুর' },
          { id: 'uttara', nameEn: 'Uttara', nameBn: 'উত্তরা' },
          { id: 'gulshan', nameEn: 'Gulshan', nameBn: 'গুলশান' },
          { id: 'banani', nameEn: 'Banani', nameBn: 'বনানী' },
          { id: 'savar', nameEn: 'Savar', nameBn: 'সাভার' },
          { id: 'dhamrai', nameEn: 'Dhamrai', nameBn: 'ধামরাই' },
          { id: 'keraniganj', nameEn: 'Keraniganj', nameBn: 'কেরানীগঞ্জ' },
          { id: 'tejgaon', nameEn: 'Tejgaon', nameBn: 'তেজগাঁও' },
          { id: 'mohammadpur', nameEn: 'Mohammadpur', nameBn: 'মোহাম্মদপুর' },
          { id: 'ramna', nameEn: 'Ramna', nameBn: 'রমনা' },
          { id: 'badda', nameEn: 'Badda', nameBn: 'বাড্ডা' },
          { id: 'jatrabari', nameEn: 'Jatrabari', nameBn: 'যাত্রাবাড়ী' },
          { id: 'khilgaon', nameEn: 'Khilgaon', nameBn: 'খিলগাঁও' },
        ],
      },
      {
        id: 'gazipur',
        nameEn: 'Gazipur',
        nameBn: 'গাজীপুর',
        upazilas: [
          { id: 'gazipur-sadar', nameEn: 'Gazipur Sadar', nameBn: 'গাজীপুর সদর' },
          { id: 'kaliakair', nameEn: 'Kaliakair', nameBn: 'কালিয়াকৈর' },
          { id: 'kaliganj-gaz', nameEn: 'Kaliganj', nameBn: 'কালীগঞ্জ' },
          { id: 'kapasia', nameEn: 'Kapasia', nameBn: 'কপাসিয়া' },
          { id: 'sreepur-gaz', nameEn: 'Sreepur', nameBn: 'শ্রীপুর' },
        ],
      },
      {
        id: 'narayanganj',
        nameEn: 'Narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        upazilas: [
          { id: 'narayanganj-sadar', nameEn: 'Narayanganj Sadar', nameBn: 'নারায়ণগঞ্জ সদর' },
          { id: 'araihazar', nameEn: 'Araihazar', nameBn: 'আড়াইহাজার' },
          { id: 'bandar', nameEn: 'Bandar', nameBn: 'বন্দর' },
          { id: 'rupganj', nameEn: 'Rupganj', nameBn: 'রূপগঞ্জ' },
          { id: 'sonargaon', nameEn: 'Sonargaon', nameBn: 'সোনারগাঁও' },
        ],
      },
      {
        id: 'tangail',
        nameEn: 'Tangail',
        nameBn: 'টাঙ্গাইল',
        upazilas: [
          { id: 'tangail-sadar', nameEn: 'Tangail Sadar', nameBn: 'টাঙ্গাইল সদর' },
          { id: 'gopalpur', nameEn: 'Gopalpur', nameBn: 'গোপালপুর' },
          { id: 'basail', nameEn: 'Basail', nameBn: 'বাসাইল' },
          { id: 'delduar', nameEn: 'Delduar', nameBn: 'দেলদুয়ার' },
          { id: 'ghatail', nameEn: 'Ghatail', nameBn: 'ঘাটাইল' },
          { id: 'kalihati', nameEn: 'Kalihati', nameBn: 'কালিহাতী' },
          { id: 'madhupur', nameEn: 'Madhupur', nameBn: 'মধুপুর' },
          { id: 'mirzapur', nameEn: 'Mirzapur', nameBn: 'মির্জাপুর' },
        ],
      },
      {
        id: 'faridpur',
        nameEn: 'Faridpur',
        nameBn: 'ফরিদপুর',
        upazilas: [
          { id: 'faridpur-sadar', nameEn: 'Faridpur Sadar', nameBn: 'ফরিদপুর সদর' },
          { id: 'alfadanga', nameEn: 'Alfadanga', nameBn: 'আলফাডাঙ্গা' },
          { id: 'bhanga', nameEn: 'Bhanga', nameBn: 'ভাঙ্গা' },
          { id: 'boalmari', nameEn: 'Boalmari', nameBn: 'বোয়ালমারী' },
          { id: 'charbhadrasan', nameEn: 'Charbhadrasan', nameBn: 'চরভদ্রাসন' },
          { id: 'sadarpur', nameEn: 'Sadarpur', nameBn: 'সদরপুর' },
        ],
      },
      {
        id: 'manikganj',
        nameEn: 'Manikganj',
        nameBn: 'মানিকগঞ্জ',
        upazilas: [
          { id: 'manikganj-sadar', nameEn: 'Manikganj Sadar', nameBn: 'মানিকগঞ্জ সদর' },
          { id: 'singair', nameEn: 'Singair', nameBn: 'সিঙ্গাইর' },
          { id: 'saturia', nameEn: 'Saturia', nameBn: 'সাটুরিয়া' },
          { id: 'shibalaya', nameEn: 'Shibalaya', nameBn: 'শিবালয়' },
          { id: 'harirampur', nameEn: 'Harirampur', nameBn: 'হরিরামপুর' },
        ],
      },
      {
        id: 'munshiganj',
        nameEn: 'Munshiganj',
        nameBn: 'মুন্সীগঞ্জ',
        upazilas: [
          { id: 'munshiganj-sadar', nameEn: 'Munshiganj Sadar', nameBn: 'মুন্সীগঞ্জ সদর' },
          { id: 'gazaria', nameEn: 'Gazaria', nameBn: 'গজারিয়া' },
          { id: 'lohajang', nameEn: 'Lohajang', nameBn: 'লৌহজং' },
          { id: 'sirajdikhan', nameEn: 'Sirajdikhan', nameBn: 'সিরাজদিখান' },
          { id: 'sreenagar', nameEn: 'Sreenagar', nameBn: 'শ্রীনগর' },
        ],
      },
      {
        id: 'narsingdi',
        nameEn: 'Narsingdi',
        nameBn: 'নরসিংদী',
        upazilas: [
          { id: 'narsingdi-sadar', nameEn: 'Narsingdi Sadar', nameBn: 'নরসিংদী সদর' },
          { id: 'belabo', nameEn: 'Belabo', nameBn: 'বেলাবো' },
          { id: 'monohardi', nameEn: 'Monohardi', nameBn: 'মনোহরদী' },
          { id: 'palash', nameEn: 'Palash', nameBn: 'পলাশ' },
          { id: 'raipura', nameEn: 'Raipura', nameBn: 'রায়পুরা' },
          { id: 'shibpur', nameEn: 'Shibpur', nameBn: 'শিবপুর' },
        ],
      },
    ],
  },

  // 2. CHITTAGONG DIVISION
  {
    id: 'chittagong',
    nameEn: 'Chittagong',
    nameBn: 'চট্টগ্রাম',
    districts: [
      {
        id: 'chittagong-dist',
        nameEn: 'Chittagong',
        nameBn: 'চট্টগ্রাম',
        upazilas: [
          { id: 'anwara', nameEn: 'Anwara', nameBn: 'আনোয়ারা' },
          { id: 'banshkhali', nameEn: 'Banshkhali', nameBn: 'বাঁশখালী' },
          { id: 'boalkhali', nameEn: 'Boalkhali', nameBn: 'বোয়ালখালী' },
          { id: 'chandanaish', nameEn: 'Chandanaish', nameBn: 'চন্দনাইশ' },
          { id: 'hathazari', nameEn: 'Hathazari', nameBn: 'হাটহাজারী' },
          { id: 'lohagara-ctg', nameEn: 'Lohagara', nameBn: 'লোহাগাড়া' },
          { id: 'mirsarai', nameEn: 'Mirsarai', nameBn: 'মিরসরাই' },
          { id: 'patiya', nameEn: 'Patiya', nameBn: 'পটিয়া' },
          { id: 'rangunia', nameEn: 'Rangunia', nameBn: 'রাঙ্গুনিয়া' },
          { id: 'sitakunda', nameEn: 'Sitakunda', nameBn: 'সীতাকুণ্ড' },
          { id: 'kotwali-ctg', nameEn: 'Kotwali', nameBn: 'কোতোয়ালী' },
        ],
      },
      {
        id: 'coxs-bazar',
        nameEn: "Cox's Bazar",
        nameBn: 'কক্সবাজার',
        upazilas: [
          { id: 'coxs-bazar-sadar', nameEn: "Cox's Bazar Sadar", nameBn: 'কক্সবাজার সদর' },
          { id: 'chakaria', nameEn: 'Chakaria', nameBn: 'চকোরিয়া' },
          { id: 'kutubdia', nameEn: 'Kutubdia', nameBn: 'কুতুবদিয়া' },
          { id: 'maheshkhali', nameEn: 'Maheshkhali', nameBn: 'মহেশখালী' },
          { id: 'ramu', nameEn: 'Ramu', nameBn: 'রামু' },
          { id: 'teknaf', nameEn: 'Teknaf', nameBn: 'টেকনাফ' },
          { id: 'ukhiya', nameEn: 'Ukhiya', nameBn: 'উখিয়া' },
        ],
      },
      {
        id: 'comilla',
        nameEn: 'Comilla',
        nameBn: 'কুমিল্লা',
        upazilas: [
          { id: 'comilla-sadar', nameEn: 'Comilla Sadar', nameBn: 'কুমিল্লা সদর' },
          { id: 'barura', nameEn: 'Barura', nameBn: 'বরুড়া' },
          { id: 'burichang', nameEn: 'Burichang', nameBn: 'বুড়িচং' },
          { id: 'chandina', nameEn: 'Chandina', nameBn: 'চান্দিনা' },
          { id: 'chauddagram', nameEn: 'Chauddagram', nameBn: 'চৌদ্দগ্রাম' },
          { id: 'daudkandi', nameEn: 'Daudkandi', nameBn: 'দাউদকান্দি' },
          { id: 'debidwar', nameEn: 'Debidwar', nameBn: 'দেবিদ্বার' },
          { id: 'laksam', nameEn: 'Laksam', nameBn: 'লাকসাম' },
        ],
      },
      {
        id: 'feni',
        nameEn: 'Feni',
        nameBn: 'ফেনী',
        upazilas: [
          { id: 'feni-sadar', nameEn: 'Feni Sadar', nameBn: 'ফেনী সদর' },
          { id: 'chhagalnaiya', nameEn: 'Chhagalnaiya', nameBn: 'ছাগলনাইয়া' },
          { id: 'daganbhuiyan', nameEn: 'Daganbhuiyan', nameBn: 'দাগনভূঞা' },
          { id: 'parshuram', nameEn: 'Parshuram', nameBn: 'পরশুরাম' },
          { id: 'sonagazi', nameEn: 'Sonagazi', nameBn: 'সোনাগাজী' },
        ],
      },
      {
        id: 'noakhali',
        nameEn: 'Noakhali',
        nameBn: 'নোয়াখালী',
        upazilas: [
          { id: 'noakhali-sadar', nameEn: 'Noakhali Sadar', nameBn: 'নোয়াখালী সদর' },
          { id: 'begumganj', nameEn: 'Begumganj', nameBn: 'বেগমগঞ্জ' },
          { id: 'chatkhil', nameEn: 'Chatkhil', nameBn: 'চাটখিল' },
          { id: 'companiganj', nameEn: 'Companiganj', nameBn: 'কোম্পানীগঞ্জ' },
          { id: 'hatiya', nameEn: 'Hatiya', nameBn: 'হাতিয়া' },
          { id: 'senbagh', nameEn: 'Senbagh', nameBn: 'সেনবাগ' },
        ],
      },
    ],
  },

  // 3. RAJSHAHI DIVISION
  {
    id: 'rajshahi',
    nameEn: 'Rajshahi',
    nameBn: 'রাজশাহী',
    districts: [
      {
        id: 'rajshahi-dist',
        nameEn: 'Rajshahi',
        nameBn: 'রাজশাহী',
        upazilas: [
          { id: 'rajshahi-sadar', nameEn: 'Rajshahi Sadar', nameBn: 'রাজশাহী সদর' },
          { id: 'bagha', nameEn: 'Bagha', nameBn: 'বাঘা' },
          { id: 'bagmara', nameEn: 'Bagmara', nameBn: 'বাগমারা' },
          { id: 'charghat', nameEn: 'Charghat', nameBn: 'চারঘাট' },
          { id: 'durgapur-raj', nameEn: 'Durgapur', nameBn: 'দুর্গাপুর' },
          { id: 'godagari', nameEn: 'Godagari', nameBn: 'গোদাগাড়ী' },
          { id: 'paba', nameEn: 'Paba', nameBn: 'পবা' },
          { id: 'puthia', nameEn: 'Puthia', nameBn: 'পুঠিয়া' },
          { id: 'tanore', nameEn: 'Tanore', nameBn: 'তানোর' },
        ],
      },
      {
        id: 'bogra',
        nameEn: 'Bogra',
        nameBn: 'বগুড়া',
        upazilas: [
          { id: 'bogra-sadar', nameEn: 'Bogra Sadar', nameBn: 'বগুড়া সদর' },
          { id: 'adamdighi', nameEn: 'Adamdighi', nameBn: 'আদমদীঘি' },
          { id: 'dhunat', nameEn: 'Dhunat', nameBn: 'ধুনট' },
          { id: 'gabtali', nameEn: 'Gabtali', nameBn: 'গাবতলী' },
          { id: 'kahaloo', nameEn: 'Kahaloo', nameBn: 'কাহালু' },
          { id: 'nandigram', nameEn: 'Nandigram', nameBn: 'নন্দীগ্রাম' },
          { id: 'sherpur-bogra', nameEn: 'Sherpur', nameBn: 'শেরপুর' },
          { id: 'shibganj-bogra', nameEn: 'Shibganj', nameBn: 'শিবগঞ্জ' },
        ],
      },
      {
        id: 'pabna',
        nameEn: 'Pabna',
        nameBn: 'পাবনা',
        upazilas: [
          { id: 'pabna-sadar', nameEn: 'Pabna Sadar', nameBn: 'পাবনা সদর' },
          { id: 'atgharia', nameEn: 'Atgharia', nameBn: 'আটঘরিয়া' },
          { id: 'bera', nameEn: 'Bera', nameBn: 'বেড়া' },
          { id: 'bhangura', nameEn: 'Bhangura', nameBn: 'ভাঙ্গুড়া' },
          { id: 'chatmohar', nameEn: 'Chatmohar', nameBn: 'চাটমোহর' },
          { id: 'ishwardi', nameEn: 'Ishwardi', nameBn: 'ঈশ্বরদী' },
          { id: 'santhia', nameEn: 'Santhia', nameBn: 'সাঁথিয়া' },
        ],
      },
    ],
  },

  // 4. KHULNA DIVISION
  {
    id: 'khulna',
    nameEn: 'Khulna',
    nameBn: 'খুলনা',
    districts: [
      {
        id: 'khulna-dist',
        nameEn: 'Khulna',
        nameBn: 'খুলনা',
        upazilas: [
          { id: 'khulna-sadar', nameEn: 'Khulna Sadar', nameBn: 'খুলনা সদর' },
          { id: 'batiaghata', nameEn: 'Batiaghata', nameBn: 'বটিয়াঘাটা' },
          { id: 'dacope', nameEn: 'Dacope', nameBn: 'দাকোপ' },
          { id: 'dumuria', nameEn: 'Dumuria', nameBn: 'ডুমুরিয়া' },
          { id: 'paikgachha', nameEn: 'Paikgachha', nameBn: 'পাইকগাছা' },
          { id: 'phultala', nameEn: 'Phultala', nameBn: 'ফুলতলা' },
          { id: 'rupsha', nameEn: 'Rupsha', nameBn: 'রূপসা' },
        ],
      },
      {
        id: 'jessore',
        nameEn: 'Jessore',
        nameBn: 'যশোর',
        upazilas: [
          { id: 'jessore-sadar', nameEn: 'Jessore Sadar', nameBn: 'যশোর সদর' },
          { id: 'abhaynagar', nameEn: 'Abhaynagar', nameBn: 'অভয়নগর' },
          { id: 'bagherpara', nameEn: 'Bagherpara', nameBn: 'বাঘারপাড়া' },
          { id: 'chaugachha', nameEn: 'Chaugachha', nameBn: 'চৌগাছা' },
          { id: 'jhikargachha', nameEn: 'Jhikargachha', nameBn: 'ঝিকরগাছা' },
          { id: 'keshabpur', nameEn: 'Keshabpur', nameBn: 'কেশবপুর' },
          { id: 'manirampur', nameEn: 'Manirampur', nameBn: 'মনিরামপুর' },
        ],
      },
      {
        id: 'kushtia',
        nameEn: 'Kushtia',
        nameBn: 'কুষ্টিয়া',
        upazilas: [
          { id: 'kushtia-sadar', nameEn: 'Kushtia Sadar', nameBn: 'কুষ্টিয়া সদর' },
          { id: 'bheramara', nameEn: 'Bheramara', nameBn: 'ভেড়ামারা' },
          { id: 'daulatpur-kush', nameEn: 'Daulatpur', nameBn: 'দৌলতপুর' },
          { id: 'kumarkhali', nameEn: 'Kumarkhali', nameBn: 'কুমারখালী' },
          { id: 'mirpur-kush', nameEn: 'Mirpur', nameBn: 'মিরপুর' },
        ],
      },
    ],
  },

  // 5. BARISAL DIVISION
  {
    id: 'barisal',
    nameEn: 'Barisal',
    nameBn: 'বরিশাল',
    districts: [
      {
        id: 'barisal-dist',
        nameEn: 'Barisal',
        nameBn: 'বরিশাল',
        upazilas: [
          { id: 'barisal-sadar', nameEn: 'Barisal Sadar', nameBn: 'বরিশাল সদর' },
          { id: 'agailjhara', nameEn: 'Agailjhara', nameBn: 'আগৈলঝাড়া' },
          { id: 'babuganj', nameEn: 'Babuganj', nameBn: 'বাবুগঞ্জ' },
          { id: 'bakerganj', nameEn: 'Bakerganj', nameBn: 'বাকেরগঞ্জ' },
          { id: 'banaripara', nameEn: 'Banaripara', nameBn: 'বানারীপাড়া' },
          { id: 'gaurnadi', nameEn: 'Gaurnadi', nameBn: 'গৌরনদী' },
          { id: 'hizla', nameEn: 'Hizla', nameBn: 'হিজলা' },
          { id: 'muladi', nameEn: 'Muladi', nameBn: 'মুলাদী' },
        ],
      },
      {
        id: 'bhola',
        nameEn: 'Bhola',
        nameBn: 'ভোলা',
        upazilas: [
          { id: 'bhola-sadar', nameEn: 'Bhola Sadar', nameBn: 'ভোলা সদর' },
          { id: 'burhanuddin', nameEn: 'Burhanuddin', nameBn: 'বোরহানউদ্দিন' },
          { id: 'char-fasson', nameEn: 'Char Fasson', nameBn: 'চর ফ্যাশন' },
          { id: 'daulatkhan', nameEn: 'Daulatkhan', nameBn: 'দৌলতখান' },
          { id: 'lalmohan', nameEn: 'Lalmohan', nameBn: 'লালমোহন' },
        ],
      },
    ],
  },

  // 6. SYLHET DIVISION
  {
    id: 'sylhet',
    nameEn: 'Sylhet',
    nameBn: 'সিলেট',
    districts: [
      {
        id: 'sylhet-dist',
        nameEn: 'Sylhet',
        nameBn: 'সিলেট',
        upazilas: [
          { id: 'sylhet-sadar', nameEn: 'Sylhet Sadar', nameBn: 'সিলেট সদর' },
          { id: 'balaganj', nameEn: 'Balaganj', nameBn: 'বালাগঞ্জ' },
          { id: 'beanibazar', nameEn: 'Beanibazar', nameBn: 'বিয়ানীবাজার' },
          { id: 'bishwanath', nameEn: 'Bishwanath', nameBn: 'বিশ্বনাথ' },
          { id: 'fenchuganj', nameEn: 'Fenchuganj', nameBn: 'ফেঞ্চুগঞ্জ' },
          { id: 'golapganj', nameEn: 'Golapganj', nameBn: 'গোলাপগঞ্জ' },
          { id: 'sreemangal-syl', nameEn: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
        ],
      },
      {
        id: 'moulvibazar',
        nameEn: 'Moulvibazar',
        nameBn: 'মৌলভীবাজার',
        upazilas: [
          { id: 'moulvibazar-sadar', nameEn: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর' },
          { id: 'barlekha', nameEn: 'Barlekha', nameBn: 'বড়লেখা' },
          { id: 'kamalganj', nameEn: 'Kamalganj', nameBn: 'কমলগঞ্জ' },
          { id: 'kulaura', nameEn: 'Kulaura', nameBn: 'কুলাউড়া' },
          { id: 'sreemangal', nameEn: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
        ],
      },
    ],
  },

  // 7. RANGPUR DIVISION
  {
    id: 'rangpur',
    nameEn: 'Rangpur',
    nameBn: 'রংপুর',
    districts: [
      {
        id: 'rangpur-dist',
        nameEn: 'Rangpur',
        nameBn: 'রংপুর',
        upazilas: [
          { id: 'rangpur-sadar', nameEn: 'Rangpur Sadar', nameBn: 'রংপুর সদর' },
          { id: 'badarganj', nameEn: 'Badarganj', nameBn: 'বদরগঞ্জ' },
          { id: 'gangachara', nameEn: 'Gangachara', nameBn: 'গংগাচড়া' },
          { id: 'kaunia', nameEn: 'Kaunia', nameBn: 'কাউনিয়া' },
          { id: 'mithapukur', nameEn: 'Mithapukur', nameBn: 'মিঠাপুকুর' },
          { id: 'pirgachha', nameEn: 'Pirgachha', nameBn: 'পীরগাছা' },
        ],
      },
      {
        id: 'dinajpur',
        nameEn: 'Dinajpur',
        nameBn: 'দিনাজপুর',
        upazilas: [
          { id: 'dinajpur-sadar', nameEn: 'Dinajpur Sadar', nameBn: 'দিনাজপুর সদর' },
          { id: 'birampur', nameEn: 'Birampur', nameBn: 'বিরামপুর' },
          { id: 'birganj', nameEn: 'Birganj', nameBn: 'বীরগঞ্জ' },
          { id: 'phulbari-din', nameEn: 'Phulbari', nameBn: 'ফুলবাড়ী' },
          { id: 'parbatipur', nameEn: 'Parbatipur', nameBn: 'পার্বতীপুর' },
        ],
      },
    ],
  },

  // 8. MYMENSINGH DIVISION
  {
    id: 'mymensingh',
    nameEn: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    districts: [
      {
        id: 'mymensingh-dist',
        nameEn: 'Mymensingh',
        nameBn: 'ময়মনসিংহ',
        upazilas: [
          { id: 'mymensingh-sadar', nameEn: 'Mymensingh Sadar', nameBn: 'ময়মনসিংহ সদর' },
          { id: 'bhaluka', nameEn: 'Bhaluka', nameBn: 'ভালুকা' },
          { id: 'fulbaria', nameEn: 'Fulbaria', nameBn: 'ফুলবাড়িয়া' },
          { id: 'gafargaon', nameEn: 'Gafargaon', nameBn: 'গফরগাঁও' },
          { id: 'muktagachha', nameEn: 'Muktagachha', nameBn: 'মুক্তাগাছা' },
          { id: 'trishal', nameEn: 'Trishal', nameBn: 'ত্রিশাল' },
        ],
      },
      {
        id: 'jamalpur',
        nameEn: 'Jamalpur',
        nameBn: 'জামালপুর',
        upazilas: [
          { id: 'jamalpur-sadar', nameEn: 'Jamalpur Sadar', nameBn: 'জামালপুর সদর' },
          { id: 'baksiganj', nameEn: 'Baksiganj', nameBn: 'বকশীগঞ্জ' },
          { id: 'dewanganj', nameEn: 'Dewanganj', nameBn: 'দেওয়ানগঞ্জ' },
          { id: 'islampur', nameEn: 'Islampur', nameBn: 'ইসলামপুর' },
          { id: 'sarishabari', nameEn: 'Sarishabari', nameBn: 'সরিষাবাড়ী' },
        ],
      },
    ],
  },
];

// Helper functions for address selection
export function getDivisions(): DivisionData[] {
  return BANGLADESH_ADDRESS_DATA;
}

export function getDistrictsByDivision(divisionId: string): DistrictData[] {
  const div = BANGLADESH_ADDRESS_DATA.find((d) => d.id === divisionId);
  return div ? div.districts : [];
}

export function getUpazilasByDistrict(divisionId: string, districtId: string): UpazilaData[] {
  const districts = getDistrictsByDivision(divisionId);
  const dist = districts.find((d) => d.id === districtId);
  return dist ? dist.upazilas : [];
}
