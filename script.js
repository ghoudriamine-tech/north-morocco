* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background: #eefaff;
  color: #17324d;
  line-height: 1.7;
}

header {
  background: linear-gradient(135deg, #0077a8, #35c9e8);
  color: white;
  text-align: center;
  padding: 45px 20px;
}

header h1 {
  font-size: 34px;
  margin-bottom: 10px;
}

header p {
  font-size: 18px;
}

nav {
  background: white;
  text-align: center;
  padding: 12px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

nav a {
  display: inline-block;
  margin: 4px;
  padding: 9px 13px;
  background: #e6f7fc;
  color: #0077a8;
  text-decoration: none;
  border-radius: 20px;
  font-weight: bold;
}

.container {
  max-width: 1100px;
  margin: auto;
  padding: 35px 20px;
}

section {
  padding: 25px 0;
}

h2 {
  text-align: center;
  color: #0077a8;
  margin-bottom: 25px;
}

.welcome {
  background: white;
  text-align: center;
  padding: 50px 20px;
}

.welcome h2 {
  font-size: 29px;
}

.quick-menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-top: 30px;
}

.quick-card {
  background: #f4fcff;
  border: 1px solid #d6eef7;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
}

.quick-card .icon {
  font-size: 42px;
}

.quick-card h3 {
  color: #0077a8;
  margin: 10px 0;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
}

.category-btn {
  border: none;
  padding: 12px 18px;
  border-radius: 25px;
  background: #dff5fc;
  color: #0077a8;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
}

.category-btn.active {
  background: #0077a8;
  color: white;
}

.search {
  width: 100%;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 25px;
  font-size: 16px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.1);
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
}

.card h3 {
  color: #0077a8;
  margin: 10px 0;
}

.icon {
  font-size: 42px;
}

.phone {
  margin-top: 10px;
  font-weight: bold;
}

.whatsapp {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 17px;
  background: #25D366;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
}

.map-button {
  display: inline-block;
  margin-top: 10px;
  margin-right: 5px;
  padding: 10px 17px;
  background: #4285F4;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
}

.map-button:hover,
.whatsapp:hover {
  opacity: 0.9;
}

.contact {
  background: white;
  text-align: center;
  padding: 45px 20px;
}

footer {
  background: #005b7a;
  color: white;
  text-align: center;
  padding: 25px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.error {
  color: #b00020;
  text-align: center;
  padding: 20px;
}
