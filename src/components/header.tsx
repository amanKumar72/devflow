import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '@/hooks/useTheme';
import { Icon, icons, withAlpha } from '@/utils/common';

const Header = ({ colors,theme, label }: { colors: ReturnType<typeof useTheme>["colors"]; theme: ReturnType<typeof useTheme>["theme"]; label: string }) => {
    const topBar = theme === "dark" ? withAlpha(colors.surface, 0.82) : withAlpha(colors.surface, 0.94);
  
  return (
    <View style={{ alignItems: "center", backgroundColor: topBar, borderBottomColor: withAlpha(colors.outlineVariant, 0.3), borderBottomWidth: 1, flexDirection: "row", height: 64, justifyContent: "space-between", paddingHorizontal: 16 }}>
            <View style={{ alignItems: "center", columnGap: 10, flexDirection: "row" }}>
              <Icon color={colors.primary} name={icons.app} size={26} />
              <Text style={{ color: colors.onSurface, fontFamily: "Inter", fontSize: 24, fontWeight: "800" }}>{label}</Text>
            </View>
            <Icon color={colors.onSurfaceVariant} name={icons.search} size={28} />
        </View>
  )
}

export default Header