import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ImageUploader from "./image-uploader";

interface GroupsDialogProps {
  dialogState: boolean;
  onClose: () => void;
  onCreateGroup: (
    name: string,
    category: string
  ) => Promise<{
    group: { id: number };
    inviteLink: string;
  }>;
  viewGroup: (groupId: number) => void;
}

const categories = ["Food", "Travel", "Housing", "Leisure", "Other"];

const GroupsDialog: React.FC<GroupsDialogProps> = ({
  dialogState,
  onClose,
  onCreateGroup,
  viewGroup,
}) => {
  const [groupName, setGroupName] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState("");
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupSetUp, setGroupSetUp] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!groupName || !category) {
      Alert.alert("Bitte füllen Sie alle Felder aus.");
      return;
    }

    setIsLoading(true);
    try {
      const { group, inviteLink } = await onCreateGroup(groupName, category);
      setGroupId(group.id);
      setInviteLink(inviteLink);
      setGroupSetUp(true);
    } catch (err) {
      Alert.alert(
        err instanceof Error ? err.message : "Fehler beim Erstellen der Gruppe"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setCategory(null);
    setInviteLink("");
    setGroupSetUp(false);
    setCopySuccess(false);
    setIsLoading(false);
    onClose();
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(inviteLink);
    setCopySuccess(true);
    Alert.alert("Copied to clipboard!");
  };

  return (
    <Modal visible={dialogState} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ImageUploader />

          {!groupSetUp ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
              />

              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      category === cat && styles.categorySelected,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        category === cat && styles.categoryTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>Create Group</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.inviteContainer}>
              <Text style={styles.inviteText}>
                Share this link to invite others to the group:
              </Text>

              <View style={styles.inviteLinkContainer}>
                <Text style={styles.inviteLink}>{inviteLink}</Text>
                <TouchableOpacity
                  onPress={copyToClipboard}
                  style={styles.iconButton}
                >
                  {copySuccess ? (
                    <Feather name="check" size={20} color="green" />
                  ) : (
                    <Feather name="copy" size={20} color="#000" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.createButton, { marginTop: 16 }]}
                onPress={() => groupId != null && viewGroup(groupId)}
                disabled={groupId == null}
              >
                <Text style={styles.createButtonText}>View Group</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GroupsDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 2,
  },
  categorySelected: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  categoryText: { color: "#000" },
  categoryTextSelected: { color: "#fff" },
  createButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  inviteContainer: { marginTop: 16 },
  inviteText: { textAlign: "center", marginBottom: 8 },
  inviteLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  inviteLink: { flex: 1, color: "#000" },
  iconButton: { marginLeft: 8 },
  closeButton: {
    marginTop: 16,
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "600" },
});
