// Node.js + Express server backend
// use SQLite (https://www.sqlite.org/index.html) as a database
//

// run this once to create the initial database file
//   node create_database.js

// to clear the database, simply delete the database file:

const sqlite3 = require('sqlite3');
const dbName = 'items.db';
const db = new sqlite3.Database(dbName);

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database tables:
  db.run("CREATE TABLE items (id INTEGER PRIMARY KEY, className TEXT, tag TEXT, description TEXT, properties TEXT)");
  // db.run("CREATE TABLE wbsitems (id INTEGER PRIMARY KEY, className TEXT, tag TEXT, description TEXT)");


  let items = [
    {className: "valve",  tag: "V-100",    desc: 'Gate Valve',        props: { manufacturer: "ABC", size: "6", length: 50, weight: 100 } },
    {className: "valve",  tag: "V-101",    desc: 'Globe Valve',       props: { manufacturer: "ABC", size: "8", length: 150, weight: 200 } },
    {className: "valve",  tag: "V-102",    desc: 'Needle Valve',      props: { manufacturer: "DEF", size: "3", length: 23, weight: 77 } },
    {className: "pump",   tag: "P-100",    desc:"Centrifugal Pump",   props: { manufacturer: "XYZ", }},
    {className: "pump",   tag: "P-101",    desc:"Centrifugal Pump",   props: { manufacturer: "XYZ", }},
    {className: "tank",   tag: "T-100",    desc:"Horizontal Tank",    props: { manufacturer: "XYZ", }},
    {className: "tank",   tag: "T-101",    desc:"Horizontal Tank",    props: { manufacturer: "XYZ", }},
  ];

  let sql = `INSERT INTO items (className, tag, description, properties)  VALUES`;
  items.forEach((item) => {
    sql = `${sql} ('${item.className}', '${item.tag}', '${item.desc}', '${JSON.stringify(item.props)}'),`;
  });

  sql = sql.substr(0,sql.length-1);

  //   ('${valve.className}', '${valve.tag}', '${valve.desc}', '${JSON.stringify(valve.props)}'),
  //   ('${pump.className}', '${pump.tag}', '${pump.desc}', '${JSON.stringify(pump.props)}'),
  //   ('${tank.className}', '${tank.tag}', '${tank.desc}', '${JSON.stringify(tank.props)}')
  // `;

  console.log (sql);
  // insert data into items table:
  db.run(sql);
         
  console.log(`successfully added items to the items table in ${dbName}`);


  
  // print them out to confirm their contents:
  db.each("SELECT * FROM items", (err, row) => {
    let item = {
      className: row.className,
      tag: row.tag,
      description: row.description,
       properties: row.properties ? JSON.parse(row.properties) : []
    };
      console.log(`className=${item.className}, tag=${item.tag}, 
                  description=${item.description},
                  properties=${JSON.stringify(item.properties)} 
                  `);

  });

});

db.close();