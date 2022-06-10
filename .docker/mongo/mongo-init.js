conn = new Mongo();
db = conn.getDB('Innovapptive');

db.categories.insertOne({
  _id: '_UnassignedCategory_',
  Category_Name: 'Unassigned',
  Cover_Image:
    'assets/work-instructions-icons/img/brand/category-placeholder.png',
  Created_At: new Date(),
  Updated_At: new Date()
});
