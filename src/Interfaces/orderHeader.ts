import { SD_Status } from "../Utility/SD";
import orderDetail from "./orderDetail";

export default interface orderHeader {
  orderHeaderId?: number;
  pickupName?: string;
  pickupPhoneNumber?: string;
  pickupEmail?: string;
  applicationUserId?: string;
  user?: any;
  orderTotal?: number;
  orderDate?: Date;
  stripePaymentIntentId?: string;
  status?: SD_Status;
  totalItems?: number;
  orderDetails?: orderDetail[];
}
