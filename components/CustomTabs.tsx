import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import theme from '../assets/styles/themes';

interface TabItem<T extends string> {
    key: T;
    label: string;
}

interface CustomTabsProps<T extends string> {
    tabs: TabItem<T>[];
    onTabChange: (key: T) => void;
    activeTab: T;
}

const CustomTabs = <T extends string>({ tabs, onTabChange, activeTab }: CustomTabsProps<T>) => {
    const screenWidth = Dimensions.get('window').width;
    const tabWidth = screenWidth / tabs.length;
    const dynamicFontSize = Math.max(12, 18 - (tabs.length));

    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.key}
                    style={[styles.tab, activeTab === tab.key ? styles.activeTab : styles.inactiveTab, { width: tabWidth }]}
                    onPress={() => onTabChange(tab.key)}
                >
                    <Text style={[styles.tabText, { fontSize: dynamicFontSize }, activeTab === tab.key && styles.activeTabText]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F8F9FA',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.text,
    },
    tab: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
    },
    inactiveTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabText: {
        color: theme.colors.text,
        textAlign: 'center'
    },
    activeTabText: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default CustomTabs;
