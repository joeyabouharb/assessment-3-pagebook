# Report Pages API Implementation


## Requirements:

To Implement a feature set that replicates and extends facebook's Pages API.
### Dependencies used:
- JSONWebToken
- Validatejs
- Express
- Argon2
- Helmet

## Security Concerns

In order to tighten the security of the system and to ensure the integrity and the confidentiality of user data, securing sensitive endpoints by requiring an authenticated user to manage their pages and posts with the use of Express middlewares is needed. This requires uses to login to request a token in order for them to securely manage their account data. Passwords will not be stored in raw text in the databased and require hashing prior to storing them in the database. The choice of encryption to be used will be argon2 - a newer and more modern encryption standard that offers more robust protection against brute force attacks, particularly against GPU and side-channel attacks that affect other algorithms like bcrypt. Preventing users from typing short passwords and requiring them to be larger than 10 characters - ensuring that cracking hashed require more time and resources - 8 characters is becoming less recommended due to the shorter cracking times on modern hardware. JWT's will be used to store uniquely identifying information for our application to identify them - Properly signed with a secret key that will be stored in our .env file and ignored in source control. Our JWT's will be signed and verified by a middleware to prevent unauthenticated users gaining access to resources. It is important not to store any sensitive data in the JWT and only store the UserID and user name, to prevent this data from being read by third parties. Care must be taken to sanitize the database to ensure its integrity. With express, we can ensure that user input can be carefully validated before hitting our endpoints, using libraries like validateJS. This was chosen due to it being lightweight and flexible, allowing us to use this library at our client side for validation as well. Finally our chosen database will be SQLite, and to ensure protection against SQL Injection queries must be parameterized and string concatenation mustn't be used. 

## Legal & Professional Obligations

As Developers, it is integral to develop and create professional softaware that behaves and performs the expectations of our client - communicated to them during the requirements phase. Clear lines of communication also need to be set if requirements need to be changed or deadlines not met. Obligations under federal and and international levels need to be considered by ensuring we keep minimal personal information about our users and properly deanonymise personally identifying information when applicable. Software used must be vetted for potential liscence clashes and must be suitable for commercial use to prevent potential legal prosecution. Setting up clear and concise protocols for maintenence to ensure future maintainers/developers update systems when vulnerabilities for software is disclosed. 
