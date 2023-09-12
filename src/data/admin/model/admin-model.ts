import mongoose, { Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  restaurantName: string;
  phone: number;
  ownerName: string;
}

const adminSchema = new mongoose.Schema<IAdmin>({
    restaurantName: {
    type: String,
    required: true
 },
 phone: {
    type: Number,
    required: true
  },
  ownerName: {
     type: String,
     required: true
   }
});

const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;