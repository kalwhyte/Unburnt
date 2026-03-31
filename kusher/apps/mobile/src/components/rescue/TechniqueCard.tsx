import { View, Text } from 'react-native';

export default function TechniqueCard({ title, description }: any) {
  return (
    <View className="bg-white p-4 rounded-2xl shadow-sm">
      <Text className="text-lg font-semibold">{title}</Text>
      <Text className="text-gray-500">{description}</Text>
    </View>
  );
}
