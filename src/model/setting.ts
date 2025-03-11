import mongoose, { Schema, Document } from "mongoose";

interface ISetting extends Document {
  bankingInfo: {
    accountNumber: string;
    accountName: string;
    bankName: string;
  };
  cryptoInfo: {
    name: string;
    network: string;
    address: string;
    rating: number;
  }[];
  mail: {
    name: string;
    password: string;
  };
}

const SettingSchema = new Schema<ISetting>({
  bankingInfo: {
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    bankName: { type: String, required: true },
    routing: { type: String, required: true },
    address: { type: String, required: true },
  },

  mobileInfo: {
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    bankName: { type: String, required: true },
    routing: { type: String, required: true },
    address: { type: String, required: true },
  },
  cryptoInfo: [
    {
      name: { type: String, required: true },
      network: { type: String, required: true },
      address: { type: String, required: true },
      rate: { type: Number, required: true },
    },
  ],
  mail: {
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
});

const Setting =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);
export default Setting;
