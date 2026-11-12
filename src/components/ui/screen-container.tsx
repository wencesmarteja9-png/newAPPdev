
import { PropsWithChildren } from 'react';
import {
    ScrollView,
    StyleProp,
    View,
    ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps extends PropsWithChildren {
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function ScreenContainer({
  children,
  scrollable = true,
  style,
}: ScreenContainerProps) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#0D0D0D',
      }}
    >
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 30,
            },
            style,
          ]}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            {
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 30,
            },
            style,
          ]}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
