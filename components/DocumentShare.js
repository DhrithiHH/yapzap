import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const DocumentShare = () => {
  const [document, setDocument] = useState(null);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type !== 'cancel') {
      setDocument(result.uri);
    }
  };

  return (
    <View>
      <Button title="Pick Document" onPress={pickDocument} />
      {document && <Text>Document: {document}</Text>}
    </View>
  );
};

export default DocumentShare;
