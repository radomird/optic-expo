import { StyleSheet, View, ScrollView } from 'react-native'
import React, { useMemo, useState } from 'react'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { TextInput, Text, Divider, FAB, Portal, List } from 'react-native-paper'

import { MainStackParamList } from '../Main'
import theme from '../lib/theme'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(3),
  },
  searchArea: {
    marginBottom: theme.spacing(2),
  },
  scrollView: {
    flexGrow: 1,
  },
  tokensCount: {
    marginBottom: theme.spacing(2),
  },
  tokensCountLabel: {
    fontFamily: 'monospace',
    fontSize: 24,
    marginRight: theme.spacing(2),
  },
  tokensCountValue: theme.typography.overline,
  tokenItem: {
    paddingHorizontal: 0,
    paddingVertical: theme.spacing(1),
    // React native paper doesn't allow overriding this https://github.com/callstack/react-native-paper/blob/b545cdcbd8c5f1bd5ad3f0e9f095c294527846a4/src/components/List/ListItem.tsx#L263
    // Needed to override the padding that's hardcoded there
    marginLeft: -8,
  },
  tokenValueText: {
    fontFamily: 'monospace',
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: theme.spacing(1),
  },
  tokenNoteText: {
    ...theme.typography.body2,
    color: theme.colors.text,
    marginHorizontal: 0,
  },
  fab: {
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    margin: theme.spacing(3),
    bottom: 0,
    alignSelf: 'center',
  },
})

type Props = NativeStackScreenProps<MainStackParamList, 'TokensList'>

export const TokensListScreen = ({ route, navigation }: Props) => {
  const { secret } = route.params
  const { tokens } = secret
  const tokensCount = tokens.length
  const [search, setSearch] = useState('')

  const showSearchArea = tokensCount > 1

  const filteredTokens = useMemo(() => {
    if (search.length > 1) {
      return tokens.filter(({ note }) =>
        note.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      return tokens
    }
  }, [search, tokens])

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.tokensCount}>
          <Text style={styles.tokensCountLabel}>{tokensCount}</Text>{' '}
          <Text style={styles.tokensCountValue}>
            {tokensCount === 1 ? 'TOKEN' : 'TOKENS'}
          </Text>
        </Text>
        {showSearchArea && (
          <View style={styles.searchArea}>
            <TextInput
              textAlign="left"
              label="Search"
              accessibilityLabel="Search"
              placeholder="Search..."
              placeholderTextColor={theme.colors.disabled}
              mode="outlined"
              value={search}
              onChangeText={setSearch}
              autoFocus
              right={<TextInput.Icon name="magnify" />}
            />
          </View>
        )}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 180 }}
        >
          {filteredTokens.map(({ token, note }) => (
            <>
              <List.Item
                key={token}
                onPress={() => navigation.navigate('Token', { secret, token })}
                style={styles.tokenItem}
                title={token}
                titleStyle={styles.tokenValueText}
                description={note}
                descriptionStyle={styles.tokenNoteText}
                descriptionNumberOfLines={1}
                right={({ style, ...props }) => (
                  <List.Icon
                    {...props}
                    icon="chevron-right"
                    style={{ ...style, alignSelf: 'center' }}
                  />
                )}
              />
              <Divider />
            </>
          ))}
        </ScrollView>
      </View>
      <Portal>
        <FAB label="Create Token" icon="plus" small style={styles.fab} />
      </Portal>
    </>
  )
}