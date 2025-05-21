/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           description: User's email address (unique)
 *         phone:
 *           type: string
 *           description: User's phone number
 *         address:
 *           type: string
 *           description: User's address
 *         password:
 *           type: string
 *           description: User's hashed password
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         name: John Doe
 *         email: john@example.com
 *         phone: "1234567890"
 *         address: "123 Main St, City"
 *         password: "$2a$10$X/KJHGA..."
 *     
 *     Plan:
 *       type: object
 *       required:
 *         - userId
 *         - place
 *         - time
 *         - date
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         userId:
 *           type: string
 *           description: Reference to the User who created the plan
 *         place:
 *           type: string
 *           description: Location for the plan
 *         time:
 *           type: string
 *           description: Time in HH:MM format
 *         date:
 *           type: string
 *           description: Date in YYYY-MM-DD format
 *       example:
 *         _id: 60d21b4667d0d8992e610c86
 *         userId: 60d21b4667d0d8992e610c85
 *         place: London
 *         time: "14:30"
 *         date: "2023-11-15"
 */
