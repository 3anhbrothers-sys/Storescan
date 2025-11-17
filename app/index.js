import { Redirect } from 'expo-router';

export default function Index() {
  // Start at location input screen instead of ask-ai
  return <Redirect href="/location-input" />;
}
