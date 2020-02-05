## 1

There are six properties of a relational database. The first property is that the values of a table are atomic and follow First Normal Form - this means that data in columns reference a single item and are not a list of items (example a list of phone numbers should be only one). The second property is that each column value should be of a consistent datatype. This means that a column named person_dob should only contain that datatype - this ensures that data will always be of an expected type during a query. The third property specifies that each row is unique and that no row in a table should be identical. This means that an order in an orders table should be uniquely identifiable with an OrderID and that their is no duplication. The fourth and fifth property is that the order of columns and rows in a relational table is insignificant is designed so that the properties and row can be queried to retrieve and order data requested. The sixth property ensures that each column name in a table must be unique and refers to a single property of an entity. 

# 2

Their are three types of relationships within a a relational database. One to One, One to Many and Many to Many all describe how one entity relates to each other. A one to on relationship specifies that a single item in one database has a single relationship with another item in a database. One example of one to one relationship in a database could be that one user in the users table will have one passport. One to many is a relationship defines that a single entry in a table could potentially have multiple relationships with other entries in another table. One example of this is an organisation could have many employees. a many to many relationship describes a relationship that many entries in a table could have many in another. One example of this is one student can be enrolled in many courses and one course have many students. These relationships are created by using primary keys and foreign keys.

A many to many relationships are created via normalisation that is both primary keys in each table are referenced in a different table. This ensures that each relationship is uniquely identified in each row and ensures atomicity (a single id instead of a list) for each column. for example the student/courses relationship example can be normalised by having another table called StudentCourses where the keys from both tables are referenced.

# 3 

Database constraints are integral in ensuring that the each entry in the database is unique and ensures that data-types can remain consistent / meaningful across each entry in the same data column. The UNIQUE constraint ensures that data in a single column remains unique and that no duplication occurs in that column. an email entry in a user column is an example of a column that should be unique for each entry. The NOT NULL constraint enforces a column to always contain a value, which means that you cannot  insert a new record, or update a record without adding a value to this  field. A user field should for example always contain a password hash. The DEFAULT constraint ensures that a default value can be used when no value is inserted in a column. One example of this could be a post entry in a blog can have it's default publishing date be the current date.



# 4

```

```

Domain Integrity in a relational database means that each column entry be the same data type, specifying datatypes in columns is required to ensure data integrity and consistency. These checks are done each time entries are added or modified in the table and rejects any changes that do not adhere to those types. Defining data types are essential for enforcing Column Integrity in a table. This means that each entry in a column must adhere to the same format and definition. For example a cost of an product in a products table must adhere to a datatype (REAL or DECIMAL) to ensure that each entry is valid currency and not any other datatype. This is important when programs query and apply specific operations on them and not cause application exceptions and undesirable behaviour. Other Datatypes that SQL generally support are Numeric, Date/Time, Character/String, Unicode,  Binary and many more. D

Setting Primary key types in a table ensures Entity Integrity be ensuring that no entry in a table is the same. Primary keys are properties of an entity that uniquely identifies each entry in a table and generally are uniquely generated (usually number increments or UUIDs). They ensure uniqueness for each data set stored in the table and reject any changes that would violate that constraint. Primary keys are a combination of both NOT NULL and UNIQUE constraints. For example a purchase order ID - will uniquely identify one order in the dataset. 

Foreign Key tpyes in a table ensure referential Integrity be ensuring consistent references to entries in another database and    prevents duplication. A foreign key is usually a reference to another set of data in another entity - often the Primary Key of another table and establishes a relationship between them between the two entities. For example a book can have a reference to an author ID, that uniquely establishes who that book was written by. They then can be reused in other book entries so that same author is referenced in different entries. Foreign keys are useful to prevent duplicating data across data entries and make it easier to maintain since author details are stored in one single entry. They also protect entries from being deleted when they are being referenced in a seperate table and also prevent a new entry into the database without a foreign key.



# 5

SQL databases follow Data Manipulation Language for transactions involving database interactions. The language  resembles simple English and generally involve simple commands like  SELECT, UPDATE, INSERT and DELETE.  SELECT statements are read operations that query the current database for a set of data, specifying the required columns in a particular table that meet a particular set of conditions. The first line of a SELECT query specifies which  columns to retrieve, followed by the FROM key word which tells the query which table to retrieve the data from. optionally a WHERE clause can also be used to then only retrieve a set of data that meets a particular set of conditions. for example, return the full name of users in the database which have been verified by email.

```sqlite
SELECT firstName + " " + lastName as fullName
FROM Users
WHERE isVerified = 1
```

INSERT statements are write operations that insert a new set of data into a table, specifying what columns to insert as well as the data to be inserted. Data entry can be done in any order as long as the order is specified in the INTO statement. The Word VALUES sets up the data to be inserted into the columns. The query is handled by the database internals and will comply with the data types of the column name

```sqlite
INSERT INTO Users(col1, col2, col3, col4)
VALUES('joe', 'patrick', 'abouharb', 'belmore'),
VALUES('jon', 'james', 'Azzi', 'bankstown')
```

UPDATE statements are another write operation that modify existing data in a table of a database by with a following condition set in the WHERE clause of the query. columns to be modified are listed in the SET command followed by the data that will be assigned to it. This query will also get executed by the database internals so any invalid properties entered will roll back any changes to the system.

```sqlite
UPDATE Users
SET
suburb = 'suburbValley',
streetAddress = '13 fake street',
zipCode = '12345'
WHERE userID = 432
```





# 6

​	An INNER JOIN is an instruction made during a SELECT statement to combine two or more sets of data into a new single table source and then return the rows where specified columns in each table are equal to each other. The query first combines every row in the first table with every row on the second and then returns the subset of the results that satisfy the condition set in the ON clause. Inner Joins are used when there is a relationship between the entities being queried - often being foreign key to primary key references in tables. For example, if we want to retrieve the supplier for each product in a product table in a query an INNER JOIN must be used to establish a relationship between the two entities, in this case ON the primary key of the suppliers table and the foreign key (supplierID) of the product table. Below is the query with an example of the result that will return from the query.

```
SELECT s.supplierName, p.productName, p.cost
FROM products p
INNER JOIN supplier s
ON s.supplierID = p.supplierID

---RESULTS---
supplierName	|productName|cost
solutions .inc	|toothbrush |5.00
```

Hence this query will return the set of results of a join between the two tables where the supplierID's between them are equal to each other.

Implicit joins are supported  in many database systems - that is using `FROM table 1, table 1 WHERE id1 = id2` but are not recommended due to the performance impact and hence no longer considered best practice.