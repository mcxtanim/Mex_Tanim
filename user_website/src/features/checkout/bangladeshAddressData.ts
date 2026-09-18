// Complete Bangladesh Administrative Hierarchy (8 Divisions, 64 Districts, 500+ Upazilas & Thanas)
// Supports bilingual search (English & বাংলা) and seamless fuzzy/slug matching.

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
  {
    "id": "dhaka",
    "nameEn": "Dhaka",
    "nameBn": "ঢাকা",
    "districts": [
      {
        "id": "dhaka-dist",
        "nameEn": "Dhaka",
        "nameBn": "ঢাকা",
        "upazilas": [
          {
            "id": "dhanmondi",
            "nameEn": "Dhanmondi",
            "nameBn": "ধানমন্ডি"
          },
          {
            "id": "mirpur",
            "nameEn": "Mirpur",
            "nameBn": "মিরপুর"
          },
          {
            "id": "uttara",
            "nameEn": "Uttara",
            "nameBn": "উত্তরা"
          },
          {
            "id": "gulshan",
            "nameEn": "Gulshan",
            "nameBn": "গুলশান"
          },
          {
            "id": "banani",
            "nameEn": "Banani",
            "nameBn": "বনানী"
          },
          {
            "id": "mohammadpur",
            "nameEn": "Mohammadpur",
            "nameBn": "মোহাম্মদপুর"
          },
          {
            "id": "badda",
            "nameEn": "Badda",
            "nameBn": "বাড্ডা"
          },
          {
            "id": "jatrabari",
            "nameEn": "Jatrabari",
            "nameBn": "যাত্রাবাড়ী"
          },
          {
            "id": "khilgaon",
            "nameEn": "Khilgaon",
            "nameBn": "খিলগাঁও"
          },
          {
            "id": "tejgaon",
            "nameEn": "Tejgaon",
            "nameBn": "তেজগাঁও"
          },
          {
            "id": "ramna",
            "nameEn": "Ramna",
            "nameBn": "রমনা"
          },
          {
            "id": "motijheel",
            "nameEn": "Motijheel",
            "nameBn": "মতিঝিল"
          },
          {
            "id": "malibagh",
            "nameEn": "Malibagh",
            "nameBn": "মালিবাগ"
          },
          {
            "id": "rampura",
            "nameEn": "Rampura",
            "nameBn": "রামপুরা"
          },
          {
            "id": "shahbagh",
            "nameEn": "Shahbagh",
            "nameBn": "শাহবাগ"
          },
          {
            "id": "lalbagh",
            "nameEn": "Lalbagh",
            "nameBn": "লালবাগ"
          },
          {
            "id": "paltan",
            "nameEn": "Paltan",
            "nameBn": "পল্টন"
          },
          {
            "id": "kafrul",
            "nameEn": "Kafrul",
            "nameBn": "কাফরুল"
          },
          {
            "id": "cantonment",
            "nameEn": "Cantonment",
            "nameBn": "ক্যান্টনমেন্ট"
          },
          {
            "id": "khilkhet",
            "nameEn": "Khilkhet",
            "nameBn": "খিলক্ষেত"
          },
          {
            "id": "bashundhara",
            "nameEn": "Bashundhara R/A",
            "nameBn": "বসুন্ধরা আ/এ"
          },
          {
            "id": "new-market",
            "nameEn": "New Market",
            "nameBn": "নিউ মার্কেট"
          },
          {
            "id": "wari",
            "nameEn": "Wari",
            "nameBn": "ওয়ারী"
          },
          {
            "id": "hazaribagh",
            "nameEn": "Hazaribagh",
            "nameBn": "হাজারীবাগ"
          },
          {
            "id": "kamrangirchar",
            "nameEn": "Kamrangirchar",
            "nameBn": "কামরাঙ্গীরচর"
          },
          {
            "id": "dhamrai",
            "nameEn": "Dhamrai",
            "nameBn": "ধামরাই"
          },
          {
            "id": "dohar",
            "nameEn": "Dohar",
            "nameBn": "দোহার"
          },
          {
            "id": "keraniganj",
            "nameEn": "Keraniganj",
            "nameBn": "কেরানীগঞ্জ"
          },
          {
            "id": "nawabganj",
            "nameEn": "Nawabganj",
            "nameBn": "নবাবগঞ্জ"
          },
          {
            "id": "savar",
            "nameEn": "Savar",
            "nameBn": "সাভার"
          }
        ]
      },
      {
        "id": "faridpur",
        "nameEn": "Faridpur",
        "nameBn": "ফরিদপুর",
        "upazilas": [
          {
            "id": "faridpur-sadar",
            "nameEn": "Faridpur Sadar",
            "nameBn": "ফরিদপুর সদর"
          },
          {
            "id": "boalmari",
            "nameEn": "Boalmari",
            "nameBn": "বোয়ালমারী"
          },
          {
            "id": "alfadanga",
            "nameEn": "Alfadanga",
            "nameBn": "আলফাডাঙ্গা"
          },
          {
            "id": "madhukhali",
            "nameEn": "Madhukhali",
            "nameBn": "মধুখালি"
          },
          {
            "id": "bhanga",
            "nameEn": "Bhanga",
            "nameBn": "ভাঙ্গা"
          },
          {
            "id": "nagarkanda",
            "nameEn": "Nagarkanda",
            "nameBn": "নগরকান্ড"
          },
          {
            "id": "charbhadrasan",
            "nameEn": "Charbhadrasan",
            "nameBn": "চরভদ্রাসন"
          },
          {
            "id": "sadarpur",
            "nameEn": "Sadarpur",
            "nameBn": "সদরপুর"
          },
          {
            "id": "shaltha",
            "nameEn": "Shaltha",
            "nameBn": "শালথা"
          }
        ]
      },
      {
        "id": "gazipur",
        "nameEn": "Gazipur",
        "nameBn": "গাজীপুর",
        "upazilas": [
          {
            "id": "gazipur-sadar",
            "nameEn": "Gazipur Sadar",
            "nameBn": "গাজীপুর সদর"
          },
          {
            "id": "kaliakior",
            "nameEn": "Kaliakior",
            "nameBn": "কালিয়াকৈর"
          },
          {
            "id": "kapasia",
            "nameEn": "Kapasia",
            "nameBn": "কাপাসিয়া"
          },
          {
            "id": "sripur",
            "nameEn": "Sripur",
            "nameBn": "শ্রীপুর"
          },
          {
            "id": "kaliganj-gaz",
            "nameEn": "Kaliganj",
            "nameBn": "কালীগঞ্জ"
          },
          {
            "id": "tongi",
            "nameEn": "Tongi",
            "nameBn": "টঙ্গি"
          }
        ]
      },
      {
        "id": "gopalganj",
        "nameEn": "Gopalganj",
        "nameBn": "গোপালগঞ্জ",
        "upazilas": [
          {
            "id": "gopalganj-sadar",
            "nameEn": "Gopalganj Sadar",
            "nameBn": "গোপালগঞ্জ সদর"
          },
          {
            "id": "kashiani",
            "nameEn": "Kashiani",
            "nameBn": "কাশিয়ানি"
          },
          {
            "id": "kotalipara",
            "nameEn": "Kotalipara",
            "nameBn": "কোটালিপাড়া"
          },
          {
            "id": "muksudpur",
            "nameEn": "Muksudpur",
            "nameBn": "মুকসুদপুর"
          },
          {
            "id": "tungipara",
            "nameEn": "Tungipara",
            "nameBn": "টুঙ্গিপাড়া"
          }
        ]
      },
      {
        "id": "kishoreganj",
        "nameEn": "Kishoreganj",
        "nameBn": "কিশোরগঞ্জ",
        "upazilas": [
          {
            "id": "astagram",
            "nameEn": "Astagram",
            "nameBn": "অষ্টগ্রাম"
          },
          {
            "id": "bajitpur",
            "nameEn": "Bajitpur",
            "nameBn": "বাজিতপুর"
          },
          {
            "id": "bhairab",
            "nameEn": "Bhairab",
            "nameBn": "ভৈরব"
          },
          {
            "id": "hossainpur",
            "nameEn": "Hossainpur",
            "nameBn": "হোসেনপুর"
          },
          {
            "id": "itna",
            "nameEn": "Itna",
            "nameBn": "ইটনা"
          },
          {
            "id": "karimganj",
            "nameEn": "Karimganj",
            "nameBn": "করিমগঞ্জ"
          },
          {
            "id": "katiadi",
            "nameEn": "Katiadi",
            "nameBn": "কতিয়াদি"
          },
          {
            "id": "kishoreganj-sadar",
            "nameEn": "Kishoreganj Sadar",
            "nameBn": "কিশোরগঞ্জ সদর"
          },
          {
            "id": "kuliarchar",
            "nameEn": "Kuliarchar",
            "nameBn": "কুলিয়ারচর"
          },
          {
            "id": "mithamain",
            "nameEn": "Mithamain",
            "nameBn": "মিঠামাইন"
          },
          {
            "id": "nikli",
            "nameEn": "Nikli",
            "nameBn": "নিকলি"
          },
          {
            "id": "pakundia",
            "nameEn": "Pakundia",
            "nameBn": "পাকুন্ডা"
          },
          {
            "id": "tarail",
            "nameEn": "Tarail",
            "nameBn": "তাড়াইল"
          }
        ]
      },
      {
        "id": "madaripur",
        "nameEn": "Madaripur",
        "nameBn": "মাদারীপুর",
        "upazilas": [
          {
            "id": "madaripur-sadar",
            "nameEn": "Madaripur Sadar",
            "nameBn": "মাদারীপুর সদর"
          },
          {
            "id": "kalkini",
            "nameEn": "Kalkini",
            "nameBn": "কালকিনি"
          },
          {
            "id": "rajoir",
            "nameEn": "Rajoir",
            "nameBn": "রাজইর"
          },
          {
            "id": "shibchar",
            "nameEn": "Shibchar",
            "nameBn": "শিবচর"
          },
          {
            "id": "dasar",
            "nameEn": "Dasar",
            "nameBn": "দশর"
          }
        ]
      },
      {
        "id": "manikganj",
        "nameEn": "Manikganj",
        "nameBn": "মানিকগঞ্জ",
        "upazilas": [
          {
            "id": "manikganj-sadar",
            "nameEn": "Manikganj Sadar",
            "nameBn": "মানিকগঞ্জ সদর"
          },
          {
            "id": "singair",
            "nameEn": "Singair",
            "nameBn": "সিঙ্গাইর"
          },
          {
            "id": "shibalaya",
            "nameEn": "Shibalaya",
            "nameBn": "শিবালয়"
          },
          {
            "id": "saturia",
            "nameEn": "Saturia",
            "nameBn": "সাটুরিয়া"
          },
          {
            "id": "harirampur",
            "nameEn": "Harirampur",
            "nameBn": "হরিরামপুর"
          },
          {
            "id": "ghior",
            "nameEn": "Ghior",
            "nameBn": "ঘিওর"
          },
          {
            "id": "daulatpur",
            "nameEn": "Daulatpur",
            "nameBn": "দৌলতপুর"
          }
        ]
      },
      {
        "id": "munshiganj",
        "nameEn": "Munshiganj",
        "nameBn": "মুন্সিগঞ্জ",
        "upazilas": [
          {
            "id": "lohajang",
            "nameEn": "Lohajang",
            "nameBn": "লোহাজং"
          },
          {
            "id": "sreenagar",
            "nameEn": "Sreenagar",
            "nameBn": "শ্রীনগর"
          },
          {
            "id": "munshiganj-sadar",
            "nameEn": "Munshiganj Sadar",
            "nameBn": "মুন্সিগঞ্জ সদর"
          },
          {
            "id": "sirajdikhan",
            "nameEn": "Sirajdikhan",
            "nameBn": "সিরাজদিখান"
          },
          {
            "id": "tongibari",
            "nameEn": "Tongibari",
            "nameBn": "টঙ্গিবাড়ি"
          },
          {
            "id": "gazaria",
            "nameEn": "Gazaria",
            "nameBn": "গজারিয়া"
          }
        ]
      },
      {
        "id": "narayanganj",
        "nameEn": "Narayanganj",
        "nameBn": "নারায়াণগঞ্জ",
        "upazilas": [
          {
            "id": "araihazar",
            "nameEn": "Araihazar",
            "nameBn": "আড়াইহাজার"
          },
          {
            "id": "sonargaon",
            "nameEn": "Sonargaon",
            "nameBn": "সোনারগাঁও"
          },
          {
            "id": "bandar",
            "nameEn": "Bandar",
            "nameBn": "বান্দার"
          },
          {
            "id": "narayanganj-sadar",
            "nameEn": "Narayanganj Sadar",
            "nameBn": "নারায়ানগঞ্জ সদর"
          },
          {
            "id": "rupganj",
            "nameEn": "Rupganj",
            "nameBn": "রূপগঞ্জ"
          },
          {
            "id": "siddhirganj",
            "nameEn": "Siddhirganj",
            "nameBn": "সিদ্ধিরগঞ্জ"
          }
        ]
      },
      {
        "id": "narsingdi",
        "nameEn": "Narsingdi",
        "nameBn": "নরসিংদী",
        "upazilas": [
          {
            "id": "belabo",
            "nameEn": "Belabo",
            "nameBn": "বেলাবো"
          },
          {
            "id": "monohardi",
            "nameEn": "Monohardi",
            "nameBn": "মনোহরদি"
          },
          {
            "id": "narsingdi-sadar",
            "nameEn": "Narsingdi Sadar",
            "nameBn": "নরসিংদী সদর"
          },
          {
            "id": "palash",
            "nameEn": "Palash",
            "nameBn": "পলাশ"
          },
          {
            "id": "raipura-narsingdi",
            "nameEn": "Raipura, Narsingdi",
            "nameBn": "রায়পুর"
          },
          {
            "id": "shibpur",
            "nameEn": "Shibpur",
            "nameBn": "শিবপুর"
          }
        ]
      },
      {
        "id": "rajbari",
        "nameEn": "Rajbari",
        "nameBn": "রাজবাড়ি",
        "upazilas": [
          {
            "id": "baliakandi",
            "nameEn": "Baliakandi",
            "nameBn": "বালিয়াকান্দি"
          },
          {
            "id": "goalandaghat",
            "nameEn": "Goalandaghat",
            "nameBn": "গোয়ালন্দ ঘাট"
          },
          {
            "id": "pangsha",
            "nameEn": "Pangsha",
            "nameBn": "পাংশা"
          },
          {
            "id": "kalukhali",
            "nameEn": "Kalukhali",
            "nameBn": "কালুখালি"
          },
          {
            "id": "rajbari-sadar",
            "nameEn": "Rajbari Sadar",
            "nameBn": "রাজবাড়ি সদর"
          }
        ]
      },
      {
        "id": "shariatpur",
        "nameEn": "Shariatpur",
        "nameBn": "শরীয়তপুর",
        "upazilas": [
          {
            "id": "shariatpur-sadar",
            "nameEn": "Shariatpur Sadar",
            "nameBn": "শরীয়তপুর সদর"
          },
          {
            "id": "damudya",
            "nameEn": "Damudya",
            "nameBn": "দামুদিয়া"
          },
          {
            "id": "naria",
            "nameEn": "Naria",
            "nameBn": "নড়িয়া"
          },
          {
            "id": "jajira",
            "nameEn": "Jajira",
            "nameBn": "জাজিরা"
          },
          {
            "id": "bhedarganj",
            "nameEn": "Bhedarganj",
            "nameBn": "ভেদারগঞ্জ"
          },
          {
            "id": "gosairhat",
            "nameEn": "Gosairhat",
            "nameBn": "গোসাইর হাট"
          }
        ]
      },
      {
        "id": "tangail",
        "nameEn": "Tangail",
        "nameBn": "টাঙ্গাইল",
        "upazilas": [
          {
            "id": "tangail-sadar",
            "nameEn": "Tangail Sadar",
            "nameBn": "টাঙ্গাইল সদর"
          },
          {
            "id": "sakhipur",
            "nameEn": "Sakhipur",
            "nameBn": "সখিপুর"
          },
          {
            "id": "basail",
            "nameEn": "Basail",
            "nameBn": "বসাইল"
          },
          {
            "id": "madhupur",
            "nameEn": "Madhupur",
            "nameBn": "মধুপুর"
          },
          {
            "id": "ghatail",
            "nameEn": "Ghatail",
            "nameBn": "ঘাটাইল"
          },
          {
            "id": "kalihati",
            "nameEn": "Kalihati",
            "nameBn": "কালিহাতি"
          },
          {
            "id": "nagarpur",
            "nameEn": "Nagarpur",
            "nameBn": "নগরপুর"
          },
          {
            "id": "mirzapur",
            "nameEn": "Mirzapur",
            "nameBn": "মির্জাপুর"
          },
          {
            "id": "gopalpur",
            "nameEn": "Gopalpur",
            "nameBn": "গোপালপুর"
          },
          {
            "id": "delduar",
            "nameEn": "Delduar",
            "nameBn": "দেলদুয়ার"
          },
          {
            "id": "bhuapur",
            "nameEn": "Bhuapur",
            "nameBn": "ভুয়াপুর"
          },
          {
            "id": "dhanbari",
            "nameEn": "Dhanbari",
            "nameBn": "ধানবাড়ি"
          }
        ]
      }
    ]
  },
  {
    "id": "chittagong",
    "nameEn": "Chattogram",
    "nameBn": "চট্টগ্রাম",
    "districts": [
      {
        "id": "bandarban",
        "nameEn": "Bandarban",
        "nameBn": "বান্দরবান",
        "upazilas": [
          {
            "id": "bandarban-sadar",
            "nameEn": "Bandarban Sadar",
            "nameBn": "বান্দরবন সদর"
          },
          {
            "id": "thanchi",
            "nameEn": "Thanchi",
            "nameBn": "থানচি"
          },
          {
            "id": "lama",
            "nameEn": "Lama",
            "nameBn": "লামা"
          },
          {
            "id": "naikhongchhari",
            "nameEn": "Naikhongchhari",
            "nameBn": "নাইখংছড়ি"
          },
          {
            "id": "ali-kadam",
            "nameEn": "Ali kadam",
            "nameBn": "আলী কদম"
          },
          {
            "id": "rowangchhari",
            "nameEn": "Rowangchhari",
            "nameBn": "রউয়াংছড়ি"
          },
          {
            "id": "ruma",
            "nameEn": "Ruma",
            "nameBn": "রুমা"
          }
        ]
      },
      {
        "id": "brahmanbaria",
        "nameEn": "Brahmanbaria",
        "nameBn": "ব্রাহ্মণবাড়িয়া",
        "upazilas": [
          {
            "id": "brahmanbaria-sadar",
            "nameEn": "Brahmanbaria Sadar",
            "nameBn": "ব্রাহ্মণবাড়িয়া সদর"
          },
          {
            "id": "ashuganj",
            "nameEn": "Ashuganj",
            "nameBn": "আশুগঞ্জ"
          },
          {
            "id": "nasirnagar",
            "nameEn": "Nasirnagar",
            "nameBn": "নাসির নগর"
          },
          {
            "id": "nabinagar",
            "nameEn": "Nabinagar",
            "nameBn": "নবীনগর"
          },
          {
            "id": "sarail",
            "nameEn": "Sarail",
            "nameBn": "সরাইল"
          },
          {
            "id": "shahbazpur-town",
            "nameEn": "Shahbazpur Town",
            "nameBn": "শাহবাজপুর টাউন"
          },
          {
            "id": "kasba",
            "nameEn": "Kasba",
            "nameBn": "কসবা"
          },
          {
            "id": "akhaura",
            "nameEn": "Akhaura",
            "nameBn": "আখাউরা"
          },
          {
            "id": "bancharampur",
            "nameEn": "Bancharampur",
            "nameBn": "বাঞ্ছারামপুর"
          },
          {
            "id": "bijoynagar",
            "nameEn": "Bijoynagar",
            "nameBn": "বিজয় নগর"
          }
        ]
      },
      {
        "id": "chandpur",
        "nameEn": "Chandpur",
        "nameBn": "চাঁদপুর",
        "upazilas": [
          {
            "id": "chandpur-sadar",
            "nameEn": "Chandpur Sadar",
            "nameBn": "চাঁদপুর সদর"
          },
          {
            "id": "faridganj",
            "nameEn": "Faridganj",
            "nameBn": "ফরিদগঞ্জ"
          },
          {
            "id": "haimchar",
            "nameEn": "Haimchar",
            "nameBn": "হাইমচর"
          },
          {
            "id": "haziganj",
            "nameEn": "Haziganj",
            "nameBn": "হাজীগঞ্জ"
          },
          {
            "id": "kachua",
            "nameEn": "Kachua",
            "nameBn": "কচুয়া"
          },
          {
            "id": "matlab-uttar",
            "nameEn": "Matlab Uttar",
            "nameBn": "মতলব উত্তর"
          },
          {
            "id": "matlab-dakkhin",
            "nameEn": "Matlab Dakkhin",
            "nameBn": "মতলব দক্ষিণ"
          },
          {
            "id": "shahrasti",
            "nameEn": "Shahrasti",
            "nameBn": "শাহরাস্তি"
          }
        ]
      },
      {
        "id": "chittagong-dist",
        "nameEn": "Chattogram",
        "nameBn": "চট্টগ্রাম",
        "upazilas": [
          {
            "id": "anwara",
            "nameEn": "Anwara",
            "nameBn": "আনোয়ারা"
          },
          {
            "id": "banshkhali",
            "nameEn": "Banshkhali",
            "nameBn": "বাশখালি"
          },
          {
            "id": "boalkhali",
            "nameEn": "Boalkhali",
            "nameBn": "বোয়ালখালি"
          },
          {
            "id": "chandanaish",
            "nameEn": "Chandanaish",
            "nameBn": "চন্দনাইশ"
          },
          {
            "id": "fatikchhari",
            "nameEn": "Fatikchhari",
            "nameBn": "ফটিকছড়ি"
          },
          {
            "id": "hathazari",
            "nameEn": "Hathazari",
            "nameBn": "হাঠহাজারী"
          },
          {
            "id": "lohagara-ctg",
            "nameEn": "Lohagara",
            "nameBn": "লোহাগারা"
          },
          {
            "id": "mirsharai",
            "nameEn": "Mirsharai",
            "nameBn": "মিরসরাই"
          },
          {
            "id": "patiya",
            "nameEn": "Patiya",
            "nameBn": "পটিয়া"
          },
          {
            "id": "rangunia",
            "nameEn": "Rangunia",
            "nameBn": "রাঙ্গুনিয়া"
          },
          {
            "id": "raozan",
            "nameEn": "Raozan",
            "nameBn": "রাউজান"
          },
          {
            "id": "sandwip",
            "nameEn": "Sandwip",
            "nameBn": "সন্দ্বীপ"
          },
          {
            "id": "satkania",
            "nameEn": "Satkania",
            "nameBn": "সাতকানিয়া"
          },
          {
            "id": "sitakunda",
            "nameEn": "Sitakunda",
            "nameBn": "সীতাকুণ্ড"
          },
          {
            "id": "kotwali-ctg",
            "nameEn": "Kotwali",
            "nameBn": "কোতোয়ালী"
          },
          {
            "id": "panchlaish",
            "nameEn": "Panchlaish",
            "nameBn": "পাঁচলাইশ"
          },
          {
            "id": "agrabad",
            "nameEn": "Agrabad / Double Mooring",
            "nameBn": "আগ্রাবাদ / ডবল মুরিং"
          },
          {
            "id": "halishahar",
            "nameEn": "Halishahar",
            "nameBn": "হালিশহর"
          },
          {
            "id": "pahartali",
            "nameEn": "Pahartali",
            "nameBn": "পাহাড়তলী"
          },
          {
            "id": "bakalia",
            "nameEn": "Bakalia",
            "nameBn": "বাকলিয়া"
          },
          {
            "id": "bayazid",
            "nameEn": "Bayazid Bostami",
            "nameBn": "বায়েজিদ বোস্তামী"
          },
          {
            "id": "chandgaon",
            "nameEn": "Chandgaon",
            "nameBn": "চান্দগাঁও"
          },
          {
            "id": "khulshi",
            "nameEn": "Khulshi",
            "nameBn": "খুলশী"
          },
          {
            "id": "patenga",
            "nameEn": "Patenga",
            "nameBn": "পতেঙ্গা"
          },
          {
            "id": "karnafuli",
            "nameEn": "Karnafuli",
            "nameBn": "কর্ণফুলী"
          }
        ]
      },
      {
        "id": "comilla",
        "nameEn": "Cumilla",
        "nameBn": "কুমিল্লা",
        "upazilas": [
          {
            "id": "barura",
            "nameEn": "Barura",
            "nameBn": "বড়ুরা"
          },
          {
            "id": "brahmanpara",
            "nameEn": "Brahmanpara",
            "nameBn": "ব্রাহ্মণপাড়া"
          },
          {
            "id": "burichong",
            "nameEn": "Burichong",
            "nameBn": "বুড়িচং"
          },
          {
            "id": "chandina",
            "nameEn": "Chandina",
            "nameBn": "চান্দিনা"
          },
          {
            "id": "chauddagram",
            "nameEn": "Chauddagram",
            "nameBn": "চৌদ্দগ্রাম"
          },
          {
            "id": "daudkandi",
            "nameEn": "Daudkandi",
            "nameBn": "দাউদকান্দি"
          },
          {
            "id": "debidwar",
            "nameEn": "Debidwar",
            "nameBn": "দেবীদ্বার"
          },
          {
            "id": "homna",
            "nameEn": "Homna",
            "nameBn": "হোমনা"
          },
          {
            "id": "comilla-sadar",
            "nameEn": "Comilla Sadar",
            "nameBn": "কুমিল্লা সদর"
          },
          {
            "id": "laksam",
            "nameEn": "Laksam",
            "nameBn": "লাকসাম"
          },
          {
            "id": "monohorgonj",
            "nameEn": "Monohorgonj",
            "nameBn": "মনোহরগঞ্জ"
          },
          {
            "id": "meghna",
            "nameEn": "Meghna",
            "nameBn": "মেঘনা"
          },
          {
            "id": "muradnagar",
            "nameEn": "Muradnagar",
            "nameBn": "মুরাদনগর"
          },
          {
            "id": "nangalkot",
            "nameEn": "Nangalkot",
            "nameBn": "নাঙ্গালকোট"
          },
          {
            "id": "comilla-sadar-south",
            "nameEn": "Comilla Sadar South",
            "nameBn": "কুমিল্লা সদর দক্ষিণ"
          },
          {
            "id": "titas",
            "nameEn": "Titas",
            "nameBn": "তিতাস"
          }
        ]
      },
      {
        "id": "coxs-bazar",
        "nameEn": "Cox's Bazar",
        "nameBn": "কক্স বাজার",
        "upazilas": [
          {
            "id": "chakaria",
            "nameEn": "Chakaria",
            "nameBn": "চকরিয়া"
          },
          {
            "id": "coxs-bazar-sadar",
            "nameEn": "Cox's Bazar Sadar",
            "nameBn": "কক্স বাজার সদর"
          },
          {
            "id": "kutubdia",
            "nameEn": "Kutubdia",
            "nameBn": "কুতুবদিয়া"
          },
          {
            "id": "maheshkhali",
            "nameEn": "Maheshkhali",
            "nameBn": "মহেশখালী"
          },
          {
            "id": "ramu",
            "nameEn": "Ramu",
            "nameBn": "রামু"
          },
          {
            "id": "teknaf",
            "nameEn": "Teknaf",
            "nameBn": "টেকনাফ"
          },
          {
            "id": "ukhia",
            "nameEn": "Ukhia",
            "nameBn": "উখিয়া"
          },
          {
            "id": "pekua",
            "nameEn": "Pekua",
            "nameBn": "পেকুয়া"
          },
          {
            "id": "eidgaon",
            "nameEn": "Eidgaon",
            "nameBn": "ঈদগাঁও"
          }
        ]
      },
      {
        "id": "feni",
        "nameEn": "Feni",
        "nameBn": "ফেনী",
        "upazilas": [
          {
            "id": "feni-sadar",
            "nameEn": "Feni Sadar",
            "nameBn": "ফেনী সদর"
          },
          {
            "id": "chagalnaiya",
            "nameEn": "Chagalnaiya",
            "nameBn": "ছাগল নাইয়া"
          },
          {
            "id": "daganbhyan",
            "nameEn": "Daganbhyan",
            "nameBn": "দাগানভিয়া"
          },
          {
            "id": "parshuram",
            "nameEn": "Parshuram",
            "nameBn": "পরশুরাম"
          },
          {
            "id": "fhulgazi",
            "nameEn": "Fhulgazi",
            "nameBn": "ফুলগাজি"
          },
          {
            "id": "sonagazi",
            "nameEn": "Sonagazi",
            "nameBn": "সোনাগাজি"
          }
        ]
      },
      {
        "id": "khagrachari",
        "nameEn": "Khagrachari",
        "nameBn": "খাগড়াছড়ি",
        "upazilas": [
          {
            "id": "dighinala",
            "nameEn": "Dighinala",
            "nameBn": "দিঘিনালা"
          },
          {
            "id": "khagrachhari",
            "nameEn": "Khagrachhari",
            "nameBn": "খাগড়াছড়ি"
          },
          {
            "id": "lakshmichhari",
            "nameEn": "Lakshmichhari",
            "nameBn": "লক্ষ্মীছড়ি"
          },
          {
            "id": "mahalchhari",
            "nameEn": "Mahalchhari",
            "nameBn": "মহলছড়ি"
          },
          {
            "id": "manikchhari",
            "nameEn": "Manikchhari",
            "nameBn": "মানিকছড়ি"
          },
          {
            "id": "matiranga",
            "nameEn": "Matiranga",
            "nameBn": "মাটিরাঙ্গা"
          },
          {
            "id": "panchhari",
            "nameEn": "Panchhari",
            "nameBn": "পানছড়ি"
          },
          {
            "id": "ramgarh",
            "nameEn": "Ramgarh",
            "nameBn": "রামগড়"
          }
        ]
      },
      {
        "id": "lakshmipur",
        "nameEn": "Lakshmipur",
        "nameBn": "লক্ষ্মীপুর",
        "upazilas": [
          {
            "id": "lakshmipur-sadar",
            "nameEn": "Lakshmipur Sadar",
            "nameBn": "লক্ষ্মীপুর সদর"
          },
          {
            "id": "raipur",
            "nameEn": "Raipur",
            "nameBn": "রায়পুর"
          },
          {
            "id": "ramganj",
            "nameEn": "Ramganj",
            "nameBn": "রামগঞ্জ"
          },
          {
            "id": "ramgati",
            "nameEn": "Ramgati",
            "nameBn": "রামগতি"
          },
          {
            "id": "komol-nagar",
            "nameEn": "Komol Nagar",
            "nameBn": "কমল নগর"
          }
        ]
      },
      {
        "id": "noakhali",
        "nameEn": "Noakhali",
        "nameBn": "নোয়াখালী",
        "upazilas": [
          {
            "id": "noakhali-sadar",
            "nameEn": "Noakhali Sadar",
            "nameBn": "নোয়াখালী সদর"
          },
          {
            "id": "begumganj",
            "nameEn": "Begumganj",
            "nameBn": "বেগমগঞ্জ"
          },
          {
            "id": "chatkhil",
            "nameEn": "Chatkhil",
            "nameBn": "চাটখিল"
          },
          {
            "id": "companyganj",
            "nameEn": "Companyganj",
            "nameBn": "কোম্পানীগঞ্জ"
          },
          {
            "id": "shenbag",
            "nameEn": "Shenbag",
            "nameBn": "শেনবাগ"
          },
          {
            "id": "hatia",
            "nameEn": "Hatia",
            "nameBn": "হাতিয়া"
          },
          {
            "id": "kobirhat",
            "nameEn": "Kobirhat",
            "nameBn": "কবিরহাট"
          },
          {
            "id": "sonaimuri",
            "nameEn": "Sonaimuri",
            "nameBn": "সোনাইমুরি"
          },
          {
            "id": "suborno-char",
            "nameEn": "Suborno Char",
            "nameBn": "সুবর্ণ চর"
          }
        ]
      },
      {
        "id": "rangamati",
        "nameEn": "Rangamati",
        "nameBn": "রাঙ্গামাটি",
        "upazilas": [
          {
            "id": "rangamati-sadar",
            "nameEn": "Rangamati Sadar",
            "nameBn": "রাঙ্গামাটি সদর"
          },
          {
            "id": "belaichhari",
            "nameEn": "Belaichhari",
            "nameBn": "বেলাইছড়ি"
          },
          {
            "id": "bagaichhari",
            "nameEn": "Bagaichhari",
            "nameBn": "বাঘাইছড়ি"
          },
          {
            "id": "barkal",
            "nameEn": "Barkal",
            "nameBn": "বরকল"
          },
          {
            "id": "juraichhari",
            "nameEn": "Juraichhari",
            "nameBn": "জুরাইছড়ি"
          },
          {
            "id": "rajasthali",
            "nameEn": "Rajasthali",
            "nameBn": "রাজাস্থলি"
          },
          {
            "id": "kaptai",
            "nameEn": "Kaptai",
            "nameBn": "কাপ্তাই"
          },
          {
            "id": "langadu",
            "nameEn": "Langadu",
            "nameBn": "লাঙ্গাডু"
          },
          {
            "id": "nannerchar",
            "nameEn": "Nannerchar",
            "nameBn": "নান্নেরচর"
          },
          {
            "id": "kaukhali",
            "nameEn": "Kaukhali",
            "nameBn": "কাউখালি"
          }
        ]
      }
    ]
  },
  {
    "id": "rajshahi",
    "nameEn": "Rajshahi",
    "nameBn": "রাজশাহী",
    "districts": [
      {
        "id": "bogra",
        "nameEn": "Bogura",
        "nameBn": "বগুড়া",
        "upazilas": [
          {
            "id": "adamdighi",
            "nameEn": "Adamdighi",
            "nameBn": "আদমদিঘী"
          },
          {
            "id": "bogra-sadar",
            "nameEn": "Bogra Sadar",
            "nameBn": "বগুড়া সদর"
          },
          {
            "id": "sherpur",
            "nameEn": "Sherpur",
            "nameBn": "শেরপুর"
          },
          {
            "id": "dhunat",
            "nameEn": "Dhunat",
            "nameBn": "ধুনট"
          },
          {
            "id": "dhupchanchia",
            "nameEn": "Dhupchanchia",
            "nameBn": "দুপচাচিয়া"
          },
          {
            "id": "gabtali",
            "nameEn": "Gabtali",
            "nameBn": "গাবতলি"
          },
          {
            "id": "kahaloo",
            "nameEn": "Kahaloo",
            "nameBn": "কাহালু"
          },
          {
            "id": "nandigram",
            "nameEn": "Nandigram",
            "nameBn": "নন্দিগ্রাম"
          },
          {
            "id": "sahajanpur",
            "nameEn": "Sahajanpur",
            "nameBn": "শাহজাহানপুর"
          },
          {
            "id": "sariakandi",
            "nameEn": "Sariakandi",
            "nameBn": "সারিয়াকান্দি"
          },
          {
            "id": "shibganj",
            "nameEn": "Shibganj",
            "nameBn": "শিবগঞ্জ"
          },
          {
            "id": "sonatala",
            "nameEn": "Sonatala",
            "nameBn": "সোনাতলা"
          }
        ]
      },
      {
        "id": "joypurhat",
        "nameEn": "Joypurhat",
        "nameBn": "জয়পুরহাট",
        "upazilas": [
          {
            "id": "joypurhat-sadar",
            "nameEn": "Joypurhat Sadar",
            "nameBn": "জয়পুরহাট সদর"
          },
          {
            "id": "akkelpur",
            "nameEn": "Akkelpur",
            "nameBn": "আক্কেলপুর"
          },
          {
            "id": "kalai",
            "nameEn": "Kalai",
            "nameBn": "কালাই"
          },
          {
            "id": "khetlal",
            "nameEn": "Khetlal",
            "nameBn": "খেতলাল"
          },
          {
            "id": "panchbibi",
            "nameEn": "Panchbibi",
            "nameBn": "পাঁচবিবি"
          }
        ]
      },
      {
        "id": "naogaon",
        "nameEn": "Naogaon",
        "nameBn": "নওগাঁ",
        "upazilas": [
          {
            "id": "naogaon-sadar",
            "nameEn": "Naogaon Sadar",
            "nameBn": "নওগাঁ সদর"
          },
          {
            "id": "mohadevpur",
            "nameEn": "Mohadevpur",
            "nameBn": "মহাদেবপুর"
          },
          {
            "id": "manda",
            "nameEn": "Manda",
            "nameBn": "মান্দা"
          },
          {
            "id": "niamatpur",
            "nameEn": "Niamatpur",
            "nameBn": "নিয়ামতপুর"
          },
          {
            "id": "atrai",
            "nameEn": "Atrai",
            "nameBn": "আত্রাই"
          },
          {
            "id": "raninagar",
            "nameEn": "Raninagar",
            "nameBn": "রাণীনগর"
          },
          {
            "id": "patnitala",
            "nameEn": "Patnitala",
            "nameBn": "পত্নীতলা"
          },
          {
            "id": "dhamoirhat",
            "nameEn": "Dhamoirhat",
            "nameBn": "ধামইরহাট"
          },
          {
            "id": "sapahar",
            "nameEn": "Sapahar",
            "nameBn": "সাপাহার"
          },
          {
            "id": "porsha",
            "nameEn": "Porsha",
            "nameBn": "পোরশা"
          },
          {
            "id": "badalgachhi",
            "nameEn": "Badalgachhi",
            "nameBn": "বদলগাছি"
          }
        ]
      },
      {
        "id": "natore",
        "nameEn": "Natore",
        "nameBn": "নাটোর",
        "upazilas": [
          {
            "id": "natore-sadar",
            "nameEn": "Natore Sadar",
            "nameBn": "নাটোর সদর"
          },
          {
            "id": "baraigram",
            "nameEn": "Baraigram",
            "nameBn": "বড়াইগ্রাম"
          },
          {
            "id": "bagatipara",
            "nameEn": "Bagatipara",
            "nameBn": "বাগাতিপাড়া"
          },
          {
            "id": "lalpur",
            "nameEn": "Lalpur",
            "nameBn": "লালপুর"
          },
          {
            "id": "natore-sadar",
            "nameEn": "Natore Sadar",
            "nameBn": "নাটোর সদর"
          },
          {
            "id": "baraigram",
            "nameEn": "Baraigram",
            "nameBn": "বড়াই গ্রাম"
          }
        ]
      },
      {
        "id": "nawabganj",
        "nameEn": "Nawabganj",
        "nameBn": "নবাবগঞ্জ",
        "upazilas": [
          {
            "id": "bholahat",
            "nameEn": "Bholahat",
            "nameBn": "ভোলাহাট"
          },
          {
            "id": "gomastapur",
            "nameEn": "Gomastapur",
            "nameBn": "গোমস্তাপুর"
          },
          {
            "id": "nachole",
            "nameEn": "Nachole",
            "nameBn": "নাচোল"
          },
          {
            "id": "nawabganj-sadar",
            "nameEn": "Nawabganj Sadar",
            "nameBn": "নবাবগঞ্জ সদর"
          },
          {
            "id": "shibganj",
            "nameEn": "Shibganj",
            "nameBn": "শিবগঞ্জ"
          }
        ]
      },
      {
        "id": "pabna",
        "nameEn": "Pabna",
        "nameBn": "পাবনা",
        "upazilas": [
          {
            "id": "atgharia",
            "nameEn": "Atgharia",
            "nameBn": "আটঘরিয়া"
          },
          {
            "id": "bera",
            "nameEn": "Bera",
            "nameBn": "বেড়া"
          },
          {
            "id": "bhangura",
            "nameEn": "Bhangura",
            "nameBn": "ভাঙ্গুরা"
          },
          {
            "id": "chatmohar",
            "nameEn": "Chatmohar",
            "nameBn": "চাটমোহর"
          },
          {
            "id": "faridpur",
            "nameEn": "Faridpur",
            "nameBn": "ফরিদপুর"
          },
          {
            "id": "ishwardi",
            "nameEn": "Ishwardi",
            "nameBn": "ঈশ্বরদী"
          },
          {
            "id": "pabna-sadar",
            "nameEn": "Pabna Sadar",
            "nameBn": "পাবনা সদর"
          },
          {
            "id": "santhia",
            "nameEn": "Santhia",
            "nameBn": "সাথিয়া"
          },
          {
            "id": "sujanagar",
            "nameEn": "Sujanagar",
            "nameBn": "সুজানগর"
          }
        ]
      },
      {
        "id": "rajshahi-dist",
        "nameEn": "Rajshahi",
        "nameBn": "রাজশাহী",
        "upazilas": [
          {
            "id": "bagha",
            "nameEn": "Bagha",
            "nameBn": "বাঘা"
          },
          {
            "id": "bagmara",
            "nameEn": "Bagmara",
            "nameBn": "বাগমারা"
          },
          {
            "id": "charghat",
            "nameEn": "Charghat",
            "nameBn": "চারঘাট"
          },
          {
            "id": "durgapur",
            "nameEn": "Durgapur",
            "nameBn": "দুর্গাপুর"
          },
          {
            "id": "godagari",
            "nameEn": "Godagari",
            "nameBn": "গোদাগারি"
          },
          {
            "id": "mohanpur",
            "nameEn": "Mohanpur",
            "nameBn": "মোহনপুর"
          },
          {
            "id": "paba",
            "nameEn": "Paba",
            "nameBn": "পবা"
          },
          {
            "id": "puthia",
            "nameEn": "Puthia",
            "nameBn": "পুঠিয়া"
          },
          {
            "id": "tanore",
            "nameEn": "Tanore",
            "nameBn": "তানোর"
          }
        ]
      },
      {
        "id": "sirajganj",
        "nameEn": "Sirajgonj",
        "nameBn": "সিরাজগঞ্জ",
        "upazilas": [
          {
            "id": "sirajganj-sadar",
            "nameEn": "Sirajganj Sadar",
            "nameBn": "সিরাজগঞ্জ সদর"
          },
          {
            "id": "belkuchi",
            "nameEn": "Belkuchi",
            "nameBn": "বেলকুচি"
          },
          {
            "id": "chauhali",
            "nameEn": "Chauhali",
            "nameBn": "চৌহালি"
          },
          {
            "id": "kamarkhanda",
            "nameEn": "Kamarkhanda",
            "nameBn": "কামারখান্দা"
          },
          {
            "id": "kazipur",
            "nameEn": "Kazipur",
            "nameBn": "কাজীপুর"
          },
          {
            "id": "raiganj",
            "nameEn": "Raiganj",
            "nameBn": "রায়গঞ্জ"
          },
          {
            "id": "shahjadpur",
            "nameEn": "Shahjadpur",
            "nameBn": "শাহজাদপুর"
          },
          {
            "id": "tarash",
            "nameEn": "Tarash",
            "nameBn": "তারাশ"
          },
          {
            "id": "ullahpara",
            "nameEn": "Ullahpara",
            "nameBn": "উল্লাপাড়া"
          }
        ]
      }
    ]
  },
  {
    "id": "khulna",
    "nameEn": "Khulna",
    "nameBn": "খুলনা",
    "districts": [
      {
        "id": "bagerhat",
        "nameEn": "Bagerhat",
        "nameBn": "বাগেরহাট",
        "upazilas": [
          {
            "id": "bagerhat-sadar",
            "nameEn": "Bagerhat Sadar",
            "nameBn": "বাগেরহাট সদর"
          },
          {
            "id": "chitalmari",
            "nameEn": "Chitalmari",
            "nameBn": "চিতলমাড়ি"
          },
          {
            "id": "fakirhat",
            "nameEn": "Fakirhat",
            "nameBn": "ফকিরহাট"
          },
          {
            "id": "kachua",
            "nameEn": "Kachua",
            "nameBn": "কচুয়া"
          },
          {
            "id": "mollahat",
            "nameEn": "Mollahat",
            "nameBn": "মোল্লাহাট"
          },
          {
            "id": "mongla",
            "nameEn": "Mongla",
            "nameBn": "মংলা"
          },
          {
            "id": "morrelganj",
            "nameEn": "Morrelganj",
            "nameBn": "মরেলগঞ্জ"
          },
          {
            "id": "rampal",
            "nameEn": "Rampal",
            "nameBn": "রামপাল"
          },
          {
            "id": "sarankhola",
            "nameEn": "Sarankhola",
            "nameBn": "স্মরণখোলা"
          }
        ]
      },
      {
        "id": "chuadanga",
        "nameEn": "Chuadanga",
        "nameBn": "চুয়াডাঙ্গা",
        "upazilas": [
          {
            "id": "damurhuda",
            "nameEn": "Damurhuda",
            "nameBn": "দামুরহুদা"
          },
          {
            "id": "chuadanga-sadar",
            "nameEn": "Chuadanga Sadar",
            "nameBn": "চুয়াডাঙ্গা সদর"
          },
          {
            "id": "jibannagar",
            "nameEn": "Jibannagar",
            "nameBn": "জীবন নগর"
          },
          {
            "id": "alamdanga",
            "nameEn": "Alamdanga",
            "nameBn": "আলমডাঙ্গা"
          }
        ]
      },
      {
        "id": "jessore",
        "nameEn": "Jashore",
        "nameBn": "যশোর",
        "upazilas": [
          {
            "id": "abhaynagar",
            "nameEn": "Abhaynagar",
            "nameBn": "অভয়নগর"
          },
          {
            "id": "keshabpur",
            "nameEn": "Keshabpur",
            "nameBn": "কেশবপুর"
          },
          {
            "id": "bagherpara",
            "nameEn": "Bagherpara",
            "nameBn": "বাঘের পাড়া"
          },
          {
            "id": "jessore-sadar",
            "nameEn": "Jessore Sadar",
            "nameBn": "যশোর সদর"
          },
          {
            "id": "chaugachha",
            "nameEn": "Chaugachha",
            "nameBn": "চৌগাছা"
          },
          {
            "id": "manirampur",
            "nameEn": "Manirampur",
            "nameBn": "মনিরামপুর"
          },
          {
            "id": "jhikargachha",
            "nameEn": "Jhikargachha",
            "nameBn": "ঝিকরগাছা"
          },
          {
            "id": "sharsha",
            "nameEn": "Sharsha",
            "nameBn": "সারশা"
          }
        ]
      },
      {
        "id": "jhenaidah",
        "nameEn": "Jhenaidah",
        "nameBn": "ঝিনাইদহ",
        "upazilas": [
          {
            "id": "jhenaidah-sadar",
            "nameEn": "Jhenaidah Sadar",
            "nameBn": "ঝিনাইদহ সদর"
          },
          {
            "id": "maheshpur",
            "nameEn": "Maheshpur",
            "nameBn": "মহেশপুর"
          },
          {
            "id": "kaliganj-gaz",
            "nameEn": "Kaliganj",
            "nameBn": "কালীগঞ্জ"
          },
          {
            "id": "kotchandpur",
            "nameEn": "Kotchandpur",
            "nameBn": "কোট চাঁদপুর"
          },
          {
            "id": "shailkupa",
            "nameEn": "Shailkupa",
            "nameBn": "শৈলকুপা"
          },
          {
            "id": "harinakunda",
            "nameEn": "Harinakunda",
            "nameBn": "হাড়িনাকুন্দা"
          }
        ]
      },
      {
        "id": "khulna-dist",
        "nameEn": "Khulna",
        "nameBn": "খুলনা",
        "upazilas": [
          {
            "id": "terokhada",
            "nameEn": "Terokhada",
            "nameBn": "তেরোখাদা"
          },
          {
            "id": "batiaghata",
            "nameEn": "Batiaghata",
            "nameBn": "বাটিয়াঘাটা"
          },
          {
            "id": "dacope",
            "nameEn": "Dacope",
            "nameBn": "ডাকপে"
          },
          {
            "id": "dumuria",
            "nameEn": "Dumuria",
            "nameBn": "ডুমুরিয়া"
          },
          {
            "id": "dighalia",
            "nameEn": "Dighalia",
            "nameBn": "দিঘলিয়া"
          },
          {
            "id": "koyra",
            "nameEn": "Koyra",
            "nameBn": "কয়ড়া"
          },
          {
            "id": "paikgachha",
            "nameEn": "Paikgachha",
            "nameBn": "পাইকগাছা"
          },
          {
            "id": "phultala",
            "nameEn": "Phultala",
            "nameBn": "ফুলতলা"
          },
          {
            "id": "rupsa",
            "nameEn": "Rupsa",
            "nameBn": "রূপসা"
          }
        ]
      },
      {
        "id": "kushtia",
        "nameEn": "Kushtia",
        "nameBn": "কুষ্টিয়া",
        "upazilas": [
          {
            "id": "kushtia-sadar",
            "nameEn": "Kushtia Sadar",
            "nameBn": "কুষ্টিয়া সদর"
          },
          {
            "id": "kumarkhali",
            "nameEn": "Kumarkhali",
            "nameBn": "কুমারখালি"
          },
          {
            "id": "daulatpur",
            "nameEn": "Daulatpur",
            "nameBn": "দৌলতপুর"
          },
          {
            "id": "mirpur",
            "nameEn": "Mirpur",
            "nameBn": "মিরপুর"
          },
          {
            "id": "bheramara",
            "nameEn": "Bheramara",
            "nameBn": "ভেরামারা"
          },
          {
            "id": "khoksa",
            "nameEn": "Khoksa",
            "nameBn": "খোকসা"
          }
        ]
      },
      {
        "id": "magura",
        "nameEn": "Magura",
        "nameBn": "মাগুরা",
        "upazilas": [
          {
            "id": "magura-sadar",
            "nameEn": "Magura Sadar",
            "nameBn": "মাগুরা সদর"
          },
          {
            "id": "mohammadpur",
            "nameEn": "Mohammadpur",
            "nameBn": "মোহাম্মাদপুর"
          },
          {
            "id": "shalikha",
            "nameEn": "Shalikha",
            "nameBn": "শালিখা"
          },
          {
            "id": "sreepur-gaz",
            "nameEn": "Sreepur",
            "nameBn": "শ্রীপুর"
          }
        ]
      },
      {
        "id": "meherpur",
        "nameEn": "Meherpur",
        "nameBn": "মেহেরপুর",
        "upazilas": [
          {
            "id": "gangni",
            "nameEn": "Gangni",
            "nameBn": "গাংনী"
          },
          {
            "id": "mujib-nagar",
            "nameEn": "Mujib Nagar",
            "nameBn": "মুজিব নগর"
          },
          {
            "id": "meherpur-sadar",
            "nameEn": "Meherpur Sadar",
            "nameBn": "মেহেরপুর সদর"
          }
        ]
      },
      {
        "id": "narail",
        "nameEn": "Narail",
        "nameBn": "নড়াইল",
        "upazilas": [
          {
            "id": "narail-sadar",
            "nameEn": "Narail Sadar",
            "nameBn": "নড়াইল সদর"
          },
          {
            "id": "lohagara-ctg",
            "nameEn": "Lohagara",
            "nameBn": "লোহাগাড়া"
          },
          {
            "id": "kalia",
            "nameEn": "Kalia",
            "nameBn": "কালিয়া"
          }
        ]
      },
      {
        "id": "satkhira",
        "nameEn": "Satkhira",
        "nameBn": "সাতক্ষীরা",
        "upazilas": [
          {
            "id": "satkhira-sadar",
            "nameEn": "Satkhira Sadar",
            "nameBn": "সাতক্ষীরা সদর"
          },
          {
            "id": "assasuni",
            "nameEn": "Assasuni",
            "nameBn": "আসসাশুনি"
          },
          {
            "id": "debhata",
            "nameEn": "Debhata",
            "nameBn": "দেভাটা"
          },
          {
            "id": "tala",
            "nameEn": "Tala",
            "nameBn": "তালা"
          },
          {
            "id": "kalaroa",
            "nameEn": "Kalaroa",
            "nameBn": "কলরোয়া"
          },
          {
            "id": "kaliganj-gaz",
            "nameEn": "Kaliganj",
            "nameBn": "কালীগঞ্জ"
          },
          {
            "id": "shyamnagar",
            "nameEn": "Shyamnagar",
            "nameBn": "শ্যামনগর"
          }
        ]
      }
    ]
  },
  {
    "id": "barishal",
    "nameEn": "Barishal",
    "nameBn": "বরিশাল",
    "districts": [
      {
        "id": "barguna",
        "nameEn": "Barguna",
        "nameBn": "বরগুনা",
        "upazilas": [
          {
            "id": "amtali",
            "nameEn": "Amtali",
            "nameBn": "আমতলী"
          },
          {
            "id": "bamna",
            "nameEn": "Bamna",
            "nameBn": "বামনা"
          },
          {
            "id": "barguna-sadar",
            "nameEn": "Barguna Sadar",
            "nameBn": "বরগুনা সদর"
          },
          {
            "id": "betagi",
            "nameEn": "Betagi",
            "nameBn": "বেতাগি"
          },
          {
            "id": "patharghata",
            "nameEn": "Patharghata",
            "nameBn": "পাথরঘাটা"
          },
          {
            "id": "taltali",
            "nameEn": "Taltali",
            "nameBn": "তালতলী"
          }
        ]
      },
      {
        "id": "barishal-dist",
        "nameEn": "Barishal",
        "nameBn": "বরিশাল",
        "upazilas": [
          {
            "id": "muladi",
            "nameEn": "Muladi",
            "nameBn": "মুলাদি"
          },
          {
            "id": "babuganj",
            "nameEn": "Babuganj",
            "nameBn": "বাবুগঞ্জ"
          },
          {
            "id": "agailjhara",
            "nameEn": "Agailjhara",
            "nameBn": "আগাইলঝরা"
          },
          {
            "id": "barisal-sadar",
            "nameEn": "Barisal Sadar",
            "nameBn": "বরিশাল সদর"
          },
          {
            "id": "bakerganj",
            "nameEn": "Bakerganj",
            "nameBn": "বাকেরগঞ্জ"
          },
          {
            "id": "banaripara",
            "nameEn": "Banaripara",
            "nameBn": "বানাড়িপারা"
          },
          {
            "id": "gaurnadi",
            "nameEn": "Gaurnadi",
            "nameBn": "গৌরনদী"
          },
          {
            "id": "hizla",
            "nameEn": "Hizla",
            "nameBn": "হিজলা"
          },
          {
            "id": "mehendiganj",
            "nameEn": "Mehendiganj",
            "nameBn": "মেহেদিগঞ্জ"
          },
          {
            "id": "wazirpur",
            "nameEn": "Wazirpur",
            "nameBn": "ওয়াজিরপুর"
          }
        ]
      },
      {
        "id": "bhola",
        "nameEn": "Bhola",
        "nameBn": "ভোলা",
        "upazilas": [
          {
            "id": "bhola-sadar",
            "nameEn": "Bhola Sadar",
            "nameBn": "ভোলা সদর"
          },
          {
            "id": "burhanuddin",
            "nameEn": "Burhanuddin",
            "nameBn": "বুরহানউদ্দিন"
          },
          {
            "id": "char-fasson",
            "nameEn": "Char Fasson",
            "nameBn": "চর ফ্যাশন"
          },
          {
            "id": "daulatkhan",
            "nameEn": "Daulatkhan",
            "nameBn": "দৌলতখান"
          },
          {
            "id": "lalmohan",
            "nameEn": "Lalmohan",
            "nameBn": "লালমোহন"
          },
          {
            "id": "manpura",
            "nameEn": "Manpura",
            "nameBn": "মনপুরা"
          },
          {
            "id": "tazumuddin",
            "nameEn": "Tazumuddin",
            "nameBn": "তাজুমুদ্দিন"
          }
        ]
      },
      {
        "id": "jhalokati",
        "nameEn": "Jhalokati",
        "nameBn": "ঝালকাঠি",
        "upazilas": [
          {
            "id": "jhalokati-sadar",
            "nameEn": "Jhalokati Sadar",
            "nameBn": "ঝালকাঠি সদর"
          },
          {
            "id": "kathalia",
            "nameEn": "Kathalia",
            "nameBn": "কাঁঠালিয়া"
          },
          {
            "id": "nalchity",
            "nameEn": "Nalchity",
            "nameBn": "নালচিতি"
          },
          {
            "id": "rajapur",
            "nameEn": "Rajapur",
            "nameBn": "রাজাপুর"
          }
        ]
      },
      {
        "id": "patuakhali",
        "nameEn": "Patuakhali",
        "nameBn": "পটুয়াখালী",
        "upazilas": [
          {
            "id": "bauphal",
            "nameEn": "Bauphal",
            "nameBn": "বাউফল"
          },
          {
            "id": "dashmina",
            "nameEn": "Dashmina",
            "nameBn": "দশমিনা"
          },
          {
            "id": "galachipa",
            "nameEn": "Galachipa",
            "nameBn": "গলাচিপা"
          },
          {
            "id": "kalapara",
            "nameEn": "Kalapara",
            "nameBn": "কালাপারা"
          },
          {
            "id": "mirzaganj",
            "nameEn": "Mirzaganj",
            "nameBn": "মির্জাগঞ্জ"
          },
          {
            "id": "patuakhali-sadar",
            "nameEn": "Patuakhali Sadar",
            "nameBn": "পটুয়াখালী সদর"
          },
          {
            "id": "dumki",
            "nameEn": "Dumki",
            "nameBn": "ডুমকি"
          },
          {
            "id": "rangabali",
            "nameEn": "Rangabali",
            "nameBn": "রাঙ্গাবালি"
          }
        ]
      },
      {
        "id": "pirojpur",
        "nameEn": "Pirojpur",
        "nameBn": "পিরোজপুর",
        "upazilas": [
          {
            "id": "bhandaria",
            "nameEn": "Bhandaria",
            "nameBn": "ভ্যান্ডারিয়া"
          },
          {
            "id": "kaukhali",
            "nameEn": "Kaukhali",
            "nameBn": "কাউখালি"
          },
          {
            "id": "mathbaria",
            "nameEn": "Mathbaria",
            "nameBn": "মাঠবাড়িয়া"
          },
          {
            "id": "nazirpur",
            "nameEn": "Nazirpur",
            "nameBn": "নাজিরপুর"
          },
          {
            "id": "nesarabad",
            "nameEn": "Nesarabad",
            "nameBn": "নেসারাবাদ"
          },
          {
            "id": "pirojpur-sadar",
            "nameEn": "Pirojpur Sadar",
            "nameBn": "পিরোজপুর সদর"
          },
          {
            "id": "zianagar",
            "nameEn": "Zianagar",
            "nameBn": "জিয়ানগর"
          }
        ]
      }
    ]
  },
  {
    "id": "sylhet",
    "nameEn": "Sylhet",
    "nameBn": "সিলেট",
    "districts": [
      {
        "id": "habiganj",
        "nameEn": "Habiganj",
        "nameBn": "হবিগঞ্জ",
        "upazilas": [
          {
            "id": "ajmiriganj",
            "nameEn": "Ajmiriganj",
            "nameBn": "আজমিরিগঞ্জ"
          },
          {
            "id": "baniachang",
            "nameEn": "Baniachang",
            "nameBn": "বানিয়াচং"
          },
          {
            "id": "bahubal",
            "nameEn": "Bahubal",
            "nameBn": "বাহুবল"
          },
          {
            "id": "chunarughat",
            "nameEn": "Chunarughat",
            "nameBn": "চুনারুঘাট"
          },
          {
            "id": "habiganj-sadar",
            "nameEn": "Habiganj Sadar",
            "nameBn": "হবিগঞ্জ সদর"
          },
          {
            "id": "lakhai",
            "nameEn": "Lakhai",
            "nameBn": "লাখাই"
          },
          {
            "id": "madhabpur",
            "nameEn": "Madhabpur",
            "nameBn": "মাধবপুর"
          },
          {
            "id": "nabiganj",
            "nameEn": "Nabiganj",
            "nameBn": "নবীগঞ্জ"
          },
          {
            "id": "shayestaganj",
            "nameEn": "Shayestaganj",
            "nameBn": "শায়েস্তাগঞ্জ"
          }
        ]
      },
      {
        "id": "moulvibazar",
        "nameEn": "Maulvibazar",
        "nameBn": "মৌলভীবাজার",
        "upazilas": [
          {
            "id": "moulvibazar-sadar",
            "nameEn": "Moulvibazar Sadar",
            "nameBn": "মৌলভীবাজার"
          },
          {
            "id": "barlekha",
            "nameEn": "Barlekha",
            "nameBn": "বড়লেখা"
          },
          {
            "id": "juri",
            "nameEn": "Juri",
            "nameBn": "জুড়ি"
          },
          {
            "id": "kamalganj",
            "nameEn": "Kamalganj",
            "nameBn": "কামালগঞ্জ"
          },
          {
            "id": "kulaura",
            "nameEn": "Kulaura",
            "nameBn": "কুলাউরা"
          },
          {
            "id": "rajnagar",
            "nameEn": "Rajnagar",
            "nameBn": "রাজনগর"
          },
          {
            "id": "sreemangal",
            "nameEn": "Sreemangal",
            "nameBn": "শ্রীমঙ্গল"
          }
        ]
      },
      {
        "id": "sunamganj",
        "nameEn": "Sunamganj",
        "nameBn": "সুনামগঞ্জ",
        "upazilas": [
          {
            "id": "bishwamvarpur",
            "nameEn": "Bishwamvarpur",
            "nameBn": "বিসশম্ভারপুর"
          },
          {
            "id": "chhatak",
            "nameEn": "Chhatak",
            "nameBn": "ছাতক"
          },
          {
            "id": "derai",
            "nameEn": "Derai",
            "nameBn": "দেড়াই"
          },
          {
            "id": "dharampasha",
            "nameEn": "Dharampasha",
            "nameBn": "ধরমপাশা"
          },
          {
            "id": "dowarabazar",
            "nameEn": "Dowarabazar",
            "nameBn": "দোয়ারাবাজার"
          },
          {
            "id": "jagannathpur",
            "nameEn": "Jagannathpur",
            "nameBn": "জগন্নাথপুর"
          },
          {
            "id": "jamalganj",
            "nameEn": "Jamalganj",
            "nameBn": "জামালগঞ্জ"
          },
          {
            "id": "sulla",
            "nameEn": "Sulla",
            "nameBn": "সুল্লা"
          },
          {
            "id": "sunamganj-sadar",
            "nameEn": "Sunamganj Sadar",
            "nameBn": "সুনামগঞ্জ সদর"
          },
          {
            "id": "shanthiganj",
            "nameEn": "Shanthiganj",
            "nameBn": "শান্তিগঞ্জ"
          },
          {
            "id": "tahirpur",
            "nameEn": "Tahirpur",
            "nameBn": "তাহিরপুর"
          },
          {
            "id": "madhyanagar",
            "nameEn": "Madhyanagar",
            "nameBn": "মধ্যনগর"
          }
        ]
      },
      {
        "id": "sylhet-dist",
        "nameEn": "Sylhet",
        "nameBn": "সিলেট",
        "upazilas": [
          {
            "id": "sylhet-sadar",
            "nameEn": "Sylhet Sadar",
            "nameBn": "সিলেট সদর"
          },
          {
            "id": "beanibazar",
            "nameEn": "Beanibazar",
            "nameBn": "বেয়ানিবাজার"
          },
          {
            "id": "bishwanath",
            "nameEn": "Bishwanath",
            "nameBn": "বিশ্বনাথ"
          },
          {
            "id": "dakshin-surma",
            "nameEn": "Dakshin Surma",
            "nameBn": "দক্ষিণ সুরমা"
          },
          {
            "id": "balaganj",
            "nameEn": "Balaganj",
            "nameBn": "বালাগঞ্জ"
          },
          {
            "id": "companiganj",
            "nameEn": "Companiganj",
            "nameBn": "কোম্পানিগঞ্জ"
          },
          {
            "id": "fenchuganj",
            "nameEn": "Fenchuganj",
            "nameBn": "ফেঞ্চুগঞ্জ"
          },
          {
            "id": "golapganj",
            "nameEn": "Golapganj",
            "nameBn": "গোলাপগঞ্জ"
          },
          {
            "id": "gowainghat",
            "nameEn": "Gowainghat",
            "nameBn": "গোয়াইনঘাট"
          },
          {
            "id": "jointapur",
            "nameEn": "Jointapur",
            "nameBn": "জৈন্তাপুর"
          },
          {
            "id": "kanaighat",
            "nameEn": "Kanaighat",
            "nameBn": "কানাইঘাট"
          },
          {
            "id": "zakiganj",
            "nameEn": "Zakiganj",
            "nameBn": "জাকিগঞ্জ"
          },
          {
            "id": "nobigonj",
            "nameEn": "Nobigonj",
            "nameBn": "নবীগঞ্জ"
          }
        ]
      }
    ]
  },
  {
    "id": "rangpur",
    "nameEn": "Rangpur",
    "nameBn": "রংপুর",
    "districts": [
      {
        "id": "dinajpur",
        "nameEn": "Dinajpur",
        "nameBn": "দিনাজপুর",
        "upazilas": [
          {
            "id": "birampur",
            "nameEn": "Birampur",
            "nameBn": "বিরামপুর"
          },
          {
            "id": "birganj",
            "nameEn": "Birganj",
            "nameBn": "বীরগঞ্জ"
          },
          {
            "id": "biral",
            "nameEn": "Biral",
            "nameBn": "বিড়াল"
          },
          {
            "id": "bochaganj",
            "nameEn": "Bochaganj",
            "nameBn": "বোচাগঞ্জ"
          },
          {
            "id": "chirirbandar",
            "nameEn": "Chirirbandar",
            "nameBn": "চিরিরবন্দর"
          },
          {
            "id": "phulbari-din",
            "nameEn": "Phulbari",
            "nameBn": "ফুলবাড়ি"
          },
          {
            "id": "ghoraghat",
            "nameEn": "Ghoraghat",
            "nameBn": "ঘোড়াঘাট"
          },
          {
            "id": "hakimpur",
            "nameEn": "Hakimpur",
            "nameBn": "হাকিমপুর"
          },
          {
            "id": "kaharole",
            "nameEn": "Kaharole",
            "nameBn": "কাহারোল"
          },
          {
            "id": "khansama",
            "nameEn": "Khansama",
            "nameBn": "খানসামা"
          },
          {
            "id": "dinajpur-sadar",
            "nameEn": "Dinajpur Sadar",
            "nameBn": "দিনাজপুর সদর"
          },
          {
            "id": "nawabganj",
            "nameEn": "Nawabganj",
            "nameBn": "নবাবগঞ্জ"
          },
          {
            "id": "parbatipur",
            "nameEn": "Parbatipur",
            "nameBn": "পার্বতীপুর"
          }
        ]
      },
      {
        "id": "gaibandha",
        "nameEn": "Gaibandha",
        "nameBn": "গাইবান্ধা",
        "upazilas": [
          {
            "id": "fulchhari",
            "nameEn": "Fulchhari",
            "nameBn": "ফুলছড়ি"
          },
          {
            "id": "gaibandha-sadar",
            "nameEn": "Gaibandha Sadar",
            "nameBn": "গাইবান্ধা সদর"
          },
          {
            "id": "gobindaganj",
            "nameEn": "Gobindaganj",
            "nameBn": "গোবিন্দগঞ্জ"
          },
          {
            "id": "palashbari",
            "nameEn": "Palashbari",
            "nameBn": "পলাশবাড়ী"
          },
          {
            "id": "sadullapur",
            "nameEn": "Sadullapur",
            "nameBn": "সাদুল্যাপুর"
          },
          {
            "id": "saghata",
            "nameEn": "Saghata",
            "nameBn": "সাঘাটা"
          },
          {
            "id": "sundarganj",
            "nameEn": "Sundarganj",
            "nameBn": "সুন্দরগঞ্জ"
          }
        ]
      },
      {
        "id": "kurigram",
        "nameEn": "Kurigram",
        "nameBn": "কুড়িগ্রাম",
        "upazilas": [
          {
            "id": "kurigram-sadar",
            "nameEn": "Kurigram Sadar",
            "nameBn": "কুড়িগ্রাম সদর"
          },
          {
            "id": "nageshwari",
            "nameEn": "Nageshwari",
            "nameBn": "নাগেশ্বরী"
          },
          {
            "id": "bhurungamari",
            "nameEn": "Bhurungamari",
            "nameBn": "ভুরুঙ্গামারি"
          },
          {
            "id": "phulbari-din",
            "nameEn": "Phulbari",
            "nameBn": "ফুলবাড়ি"
          },
          {
            "id": "rajarhat",
            "nameEn": "Rajarhat",
            "nameBn": "রাজারহাট"
          },
          {
            "id": "ulipur",
            "nameEn": "Ulipur",
            "nameBn": "উলিপুর"
          },
          {
            "id": "chilmari",
            "nameEn": "Chilmari",
            "nameBn": "চিলমারি"
          },
          {
            "id": "rowmari",
            "nameEn": "Rowmari",
            "nameBn": "রউমারি"
          },
          {
            "id": "char-rajibpur",
            "nameEn": "Char Rajibpur",
            "nameBn": "চর রাজিবপুর"
          }
        ]
      },
      {
        "id": "lalmonirhat",
        "nameEn": "Lalmonirhat",
        "nameBn": "লালমনিরহাট",
        "upazilas": [
          {
            "id": "lalmanirhat-sadar",
            "nameEn": "Lalmanirhat Sadar",
            "nameBn": "লালমনিরহাট সদর"
          },
          {
            "id": "aditmari",
            "nameEn": "Aditmari",
            "nameBn": "আদিতমারি"
          },
          {
            "id": "kaliganj-gaz",
            "nameEn": "Kaliganj",
            "nameBn": "কালীগঞ্জ"
          },
          {
            "id": "hatibandha",
            "nameEn": "Hatibandha",
            "nameBn": "হাতিবান্ধা"
          },
          {
            "id": "patgram",
            "nameEn": "Patgram",
            "nameBn": "পাটগ্রাম"
          }
        ]
      },
      {
        "id": "nilphamari",
        "nameEn": "Nilphamari",
        "nameBn": "নীলফামারী",
        "upazilas": [
          {
            "id": "nilphamari-sadar",
            "nameEn": "Nilphamari Sadar",
            "nameBn": "নীলফামারী সদর"
          },
          {
            "id": "saidpur",
            "nameEn": "Saidpur",
            "nameBn": "সৈয়দপুর"
          },
          {
            "id": "jaldhaka",
            "nameEn": "Jaldhaka",
            "nameBn": "জলঢাকা"
          },
          {
            "id": "kishoreganj",
            "nameEn": "Kishoreganj",
            "nameBn": "কিশোরগঞ্জ"
          },
          {
            "id": "domar",
            "nameEn": "Domar",
            "nameBn": "ডোমার"
          },
          {
            "id": "dimla",
            "nameEn": "Dimla",
            "nameBn": "ডিমলা"
          }
        ]
      },
      {
        "id": "panchagarh",
        "nameEn": "Panchagarh",
        "nameBn": "পঞ্চগড়",
        "upazilas": [
          {
            "id": "panchagarh-sadar",
            "nameEn": "Panchagarh Sadar",
            "nameBn": "পঞ্চগড় সদর"
          },
          {
            "id": "debiganj",
            "nameEn": "Debiganj",
            "nameBn": "দেবীগঞ্জ"
          },
          {
            "id": "boda",
            "nameEn": "Boda",
            "nameBn": "বোদা"
          },
          {
            "id": "atwari",
            "nameEn": "Atwari",
            "nameBn": "আটোয়ারি"
          },
          {
            "id": "tetulia",
            "nameEn": "Tetulia",
            "nameBn": "তেঁতুলিয়া"
          }
        ]
      },
      {
        "id": "rangpur-dist",
        "nameEn": "Rangpur",
        "nameBn": "রংপুর",
        "upazilas": [
          {
            "id": "badarganj",
            "nameEn": "Badarganj",
            "nameBn": "বদরগঞ্জ"
          },
          {
            "id": "mithapukur",
            "nameEn": "Mithapukur",
            "nameBn": "মিঠাপুকুর"
          },
          {
            "id": "gangachara",
            "nameEn": "Gangachara",
            "nameBn": "গঙ্গাচরা"
          },
          {
            "id": "kaunia",
            "nameEn": "Kaunia",
            "nameBn": "কাউনিয়া"
          },
          {
            "id": "rangpur-sadar",
            "nameEn": "Rangpur Sadar",
            "nameBn": "রংপুর সদর"
          },
          {
            "id": "pirgachha",
            "nameEn": "Pirgachha",
            "nameBn": "পীরগাছা"
          },
          {
            "id": "pirganj",
            "nameEn": "Pirganj",
            "nameBn": "পীরগঞ্জ"
          },
          {
            "id": "taraganj",
            "nameEn": "Taraganj",
            "nameBn": "তারাগঞ্জ"
          }
        ]
      },
      {
        "id": "thakurgaon",
        "nameEn": "Thakurgaon",
        "nameBn": "ঠাকুরগাঁও",
        "upazilas": [
          {
            "id": "thakurgaon-sadar",
            "nameEn": "Thakurgaon Sadar",
            "nameBn": "ঠাকুরগাঁও সদর"
          },
          {
            "id": "pirganj",
            "nameEn": "Pirganj",
            "nameBn": "পীরগঞ্জ"
          },
          {
            "id": "baliadangi",
            "nameEn": "Baliadangi",
            "nameBn": "বালিয়াডাঙ্গি"
          },
          {
            "id": "haripur",
            "nameEn": "Haripur",
            "nameBn": "হরিপুর"
          },
          {
            "id": "ranisankail",
            "nameEn": "Ranisankail",
            "nameBn": "রাণীশংকৈল"
          }
        ]
      }
    ]
  },
  {
    "id": "mymensingh",
    "nameEn": "Mymensingh",
    "nameBn": "ময়মনসিংহ",
    "districts": [
      {
        "id": "jamalpur",
        "nameEn": "Jamalpur",
        "nameBn": "জামালপুর",
        "upazilas": [
          {
            "id": "dewanganj",
            "nameEn": "Dewanganj",
            "nameBn": "দেওয়ানগঞ্জ"
          },
          {
            "id": "baksiganj",
            "nameEn": "Baksiganj",
            "nameBn": "বকসিগঞ্জ"
          },
          {
            "id": "islampur",
            "nameEn": "Islampur",
            "nameBn": "ইসলামপুর"
          },
          {
            "id": "jamalpur-sadar",
            "nameEn": "Jamalpur Sadar",
            "nameBn": "জামালপুর সদর"
          },
          {
            "id": "madarganj",
            "nameEn": "Madarganj",
            "nameBn": "মাদারগঞ্জ"
          },
          {
            "id": "melandaha",
            "nameEn": "Melandaha",
            "nameBn": "মেলানদাহা"
          },
          {
            "id": "sarishabari",
            "nameEn": "Sarishabari",
            "nameBn": "সরিষাবাড়ি"
          },
          {
            "id": "narundi-police-i-c",
            "nameEn": "Narundi Police I.C",
            "nameBn": "নারুন্দি"
          }
        ]
      },
      {
        "id": "mymensingh-dist",
        "nameEn": "Mymensingh",
        "nameBn": "ময়মনসিংহ",
        "upazilas": [
          {
            "id": "bhaluka",
            "nameEn": "Bhaluka",
            "nameBn": "ভালুকা"
          },
          {
            "id": "trishal",
            "nameEn": "Trishal",
            "nameBn": "ত্রিশাল"
          },
          {
            "id": "haluaghat",
            "nameEn": "Haluaghat",
            "nameBn": "হালুয়াঘাট"
          },
          {
            "id": "muktagachha",
            "nameEn": "Muktagachha",
            "nameBn": "মুক্তাগাছা"
          },
          {
            "id": "dhobaura",
            "nameEn": "Dhobaura",
            "nameBn": "ধবারুয়া"
          },
          {
            "id": "fulbaria",
            "nameEn": "Fulbaria",
            "nameBn": "ফুলবাড়িয়া"
          },
          {
            "id": "gaffargaon",
            "nameEn": "Gaffargaon",
            "nameBn": "গফরগাঁও"
          },
          {
            "id": "gauripur",
            "nameEn": "Gauripur",
            "nameBn": "গৌরিপুর"
          },
          {
            "id": "ishwarganj",
            "nameEn": "Ishwarganj",
            "nameBn": "ঈশ্বরগঞ্জ"
          },
          {
            "id": "mymensingh-sadar",
            "nameEn": "Mymensingh Sadar",
            "nameBn": "ময়মনসিং সদর"
          },
          {
            "id": "nandail",
            "nameEn": "Nandail",
            "nameBn": "নন্দাইল"
          },
          {
            "id": "phulpur",
            "nameEn": "Phulpur",
            "nameBn": "ফুলপুর"
          }
        ]
      },
      {
        "id": "netrokona",
        "nameEn": "Netrokona",
        "nameBn": "নেত্রকোণা",
        "upazilas": [
          {
            "id": "kendua",
            "nameEn": "Kendua",
            "nameBn": "কেন্দুয়া"
          },
          {
            "id": "atpara",
            "nameEn": "Atpara",
            "nameBn": "আটপাড়া"
          },
          {
            "id": "barhatta",
            "nameEn": "Barhatta",
            "nameBn": "বরহাট্টা"
          },
          {
            "id": "durgapur",
            "nameEn": "Durgapur",
            "nameBn": "দুর্গাপুর"
          },
          {
            "id": "kalmakanda",
            "nameEn": "Kalmakanda",
            "nameBn": "কলমাকান্দা"
          },
          {
            "id": "madan",
            "nameEn": "Madan",
            "nameBn": "মদন"
          },
          {
            "id": "mohanganj",
            "nameEn": "Mohanganj",
            "nameBn": "মোহনগঞ্জ"
          },
          {
            "id": "netrokona-sadar",
            "nameEn": "Netrokona Sadar",
            "nameBn": "নেত্রকোনা সদর"
          },
          {
            "id": "purbadhala",
            "nameEn": "Purbadhala",
            "nameBn": "পূর্বধলা"
          },
          {
            "id": "khaliajuri",
            "nameEn": "Khaliajuri",
            "nameBn": "খালিয়াজুরি"
          }
        ]
      },
      {
        "id": "sherpur",
        "nameEn": "Sherpur",
        "nameBn": "শেরপুর",
        "upazilas": [
          {
            "id": "jhenaigati",
            "nameEn": "Jhenaigati",
            "nameBn": "ঝিনাইগাতি"
          },
          {
            "id": "nakla",
            "nameEn": "Nakla",
            "nameBn": "নাকলা"
          },
          {
            "id": "nalitabari",
            "nameEn": "Nalitabari",
            "nameBn": "নালিতাবাড়ি"
          },
          {
            "id": "sherpur-sadar",
            "nameEn": "Sherpur Sadar",
            "nameBn": "শেরপুর সদর"
          },
          {
            "id": "sreebardi",
            "nameEn": "Sreebardi",
            "nameBn": "শ্রীবরদি"
          }
        ]
      }
    ]
  }
];

// Helper functions for address selection
export function getDivisions(): DivisionData[] {
  return BANGLADESH_ADDRESS_DATA;
}

export function getDistrictsByDivision(divisionId: string): DistrictData[] {
  if (!divisionId) return [];
  const normalized = divisionId.toLowerCase().trim();
  const div = BANGLADESH_ADDRESS_DATA.find(
    (d) =>
      d.id === normalized ||
      d.nameEn.toLowerCase() === normalized ||
      d.nameBn === normalized ||
      (normalized === 'chattogram' && d.id === 'chittagong') ||
      (normalized === 'chittagong' && d.id === 'chittagong')
  );
  return div ? div.districts : [];
}

export function getUpazilasByDistrict(divisionId: string, districtId: string): UpazilaData[] {
  if (!districtId) return [];
  const districts = getDistrictsByDivision(divisionId);
  const normalized = districtId.toLowerCase().trim();
  const dist = districts.find(
    (d) =>
      d.id === normalized ||
      d.nameEn.toLowerCase() === normalized ||
      d.nameBn === normalized ||
      d.id.replace(/-dist$/, '') === normalized.replace(/-dist$/, '')
  );
  return dist ? dist.upazilas : [];
}

export function findDivision(query: string): DivisionData | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim();
  return BANGLADESH_ADDRESS_DATA.find(
    (d) =>
      d.id === q ||
      d.nameEn.toLowerCase() === q ||
      d.nameBn === q ||
      (q === 'chattogram' && d.id === 'chittagong') ||
      (q === 'chittagong' && d.id === 'chittagong')
  );
}

export function findDistrict(divisionId: string, query: string): DistrictData | undefined {
  if (!query) return undefined;
  const districts = getDistrictsByDivision(divisionId);
  const q = query.toLowerCase().trim();
  return districts.find(
    (d) =>
      d.id === q ||
      d.nameEn.toLowerCase() === q ||
      d.nameBn === q ||
      d.id.replace(/-dist$/, '') === q.replace(/-dist$/, '')
  );
}

export function findUpazila(divisionId: string, districtId: string, query: string): UpazilaData | undefined {
  if (!query) return undefined;
  const upazilas = getUpazilasByDistrict(divisionId, districtId);
  const q = query.toLowerCase().trim();
  return upazilas.find(
    (u) =>
      u.id === q ||
      u.nameEn.toLowerCase() === q ||
      u.nameBn === q ||
      u.id.replace(/-(ctg|gaz|din)$/, '') === q.replace(/-(ctg|gaz|din)$/, '')
  );
}
