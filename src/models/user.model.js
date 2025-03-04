import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Esquema del Usuario
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  role: { type: String, default: "user" },
});


// Método para comparar contraseñas (en login)
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


const User = mongoose.model("User", userSchema);

export default User;
