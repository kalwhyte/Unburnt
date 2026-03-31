import { Alert, Linking } from "react-native";

export const promptForReview = () => {
  Alert.alert(
    "Enjoying Unburnt?",
    "Your feedback helps us improve and help more people quit smoking.",
    [
      {
        text: "Later",
        style: "cancel",
      },
      {
        text: "Rate Us",
        onPress: () => {
          // Replace with actual store IDs
          const url = "https://apps.apple.com/app/idYOUR_ID";
          Linking.openURL(url);
        },
      },
    ]
  );
};

export const promptForSupport = () => {
  Alert.alert(
    "Need Help?",
    "Our support team is available 24/7 to help you stay on track.",
    [
      {
        text: "Dismiss",
        style: "cancel",
      },
      {
        text: "Contact Support",
        onPress: () => Linking.openURL("mailto:support@unburnt.app"),
      },
    ]
  );
};
