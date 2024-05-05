import { SD_Status } from "../Utility/SD";

const getStatusColor = (status: SD_Status) => {
  if (status === SD_Status.CONFIRMED) return "primary";
  else if (status === SD_Status.PENDING) return "secondary";
  else if (status === SD_Status.CANCELLED) return "danger";
  else if (status === SD_Status.COMPLETED) return "success";
  else if (status === SD_Status.BEING_COOKED) return "info";
  else if (status === SD_Status.READY_FOR_PICKUP) return "warning";
  else return "light";
};

export default getStatusColor;
