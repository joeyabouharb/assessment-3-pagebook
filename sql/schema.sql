CREATE TABLE Accounts (
  accountID TEXT PRIMARY KEY,
  userName VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  isVerified INTEGER NOT NULL,
  isTwoFactor INTEGER NOT NULL,
  token VARCHAR(100) NOT NULL,
  CHECK (isVerified == 0 or isVerified == 1),
  CHECK (isTwoFactor == 0 or isTwoFactor == 1)
);

CREATE TABLE Pages (
	pageID TEXT PRIMARY KEY NOT NULL,
	pageName VARCHAR(50) NOT NULL UNIQUE,
	pageEmail VARCHAR(50) NOT NULL,
	pageAddress VARCHAR(100) NOT NULL,
	pageZip VARCHAR(4) NOT NULL,
	pageState VARCHAR(5) NOT NULL,
	pageCountry VARCHAR(100) NOT NULL,
	pagePhone VARCHAR(15) NOT NULL,
	accountID TEXT NOT NULL,
	FOREIGN KEY(accountID)
		REFERENCES Accounts(accountID)
);

CREATE TABLE Posts (
	postID TEXT PRIMARY KEY,
	postContent BLOB NOT NULL,
	postCreated DATETIME NOT NULL,
	pageID TEXT NOT NULL,
	isPublished INTEGER NOT NULL,
	CHECK (isPublished == 0 or isPublished == 1),
	FOREIGN KEY(pageID)
		REFERENCES Pages(pageID)
);

CREATE TABLE PostAnalysis (
	postID TEXT NOT NULL UNIQUE,
	results TEXT NOT NULL,
	confidence INTEGER NOT NULL,
	estimatedLikes INTEGER NOT NULL,
	FOREIGN KEY(postID)
		REFERENCES Posts(postID),
	CHECK (confidence >= 0 and confidence <= 5),
	CHECK (
		results == 'ugly'
		or results == 'bad'
		or results == 'neutral'
		or results == 'good'
		or results == 'great'
	)
);

CREATE TABLE postLikes (
	postID TEXT NOT NULL,
	accountID TEXT NOT NULL,
	FOREIGN KEY(postID)
		REFERENCES Posts(postID),
	FOREIGN KEY(accountID)
		REFERENCES Accounts(accountID)
);

CREATE TABLE Comments (
	commentID TEXT PRIMARY KEY,
	commentContent BLOB NOT NULL,
	commentCreated DATETIME NOT NULL,
	commentUpdated DATETIME NOT NULL,
	postID TEXT NOT NULL,
	FOREIGN KEY(postID)
		REFERENCES Posts(postID)
);

CREATE TABLE commentLikes(
	commentID TEXT NOT NULL,
	accountID TEXT NOT NULL,
	FOREIGN KEY(commentID)
		REFERENCES Comments(commentID),
	FOREIGN KEY(accountID)
		REFERENCES Accounts(accountID)
);

CREATE TABLE Followers(
	AccountID TEXT NOT NULL,
	pageID TEXT NOT NULL,
	FOREIGN KEY(AccountID)
		REFERENCES Accounts(AccountID),
	FOREIGN KEY(pageID)
		REFERENCES Pages(pageID)
);