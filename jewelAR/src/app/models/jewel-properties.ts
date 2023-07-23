export class JewelProperties {
  static categories = ['Earring', 'Necklace', 'Nosepin', 'Nethichutti', 'Ring', 'Bangle'];
  static purity = ['24 KT', '22 KT', '18 KT', '14 KT'];
  static metalType = ['Gold', 'Silver', 'Platinum','Diamond'];
}

export class JewelCategoryGroup {
  static faceCategories = ['All', 'Earring', 'Necklace', 'Nosepin', 'Nethichutti'];
  static handCategories = ['Ring', 'Bangle'];
}

export class JewelFields {
  jewellerId: string;
  subCategoriesForCategory: SubCategoriesForCategory[];
  purity: string[];
  metalType: string[];
}

export class SubCategoriesForCategory {
  category: string;
  subCategory: string[];
}