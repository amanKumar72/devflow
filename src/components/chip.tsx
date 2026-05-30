import { Text } from 'react-native'
import React from 'react'
import { useTheme } from '@/hooks/useTheme';


function Chip({ colors, label }: { colors: ReturnType<typeof useTheme>["colors"]; label: string }) {
  return <Text style={{ backgroundColor: colors.surfaceContainerHigh, borderRadius: 5, color: colors.onSurfaceVariant, fontFamily: "JetBrains Mono", fontSize: 12, paddingHorizontal: 10, paddingVertical: 6 }}>{label}</Text>;
}

export default Chip