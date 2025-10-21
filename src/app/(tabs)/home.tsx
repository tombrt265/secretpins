import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GroupsDialog from "../../components/groups-dialog";

interface Group {
  id: number;
  name: string;
  category: string;
  avatar_url: string;
  owner_id: number;
}

const API_BASE = "https://example.com"; // Passe deine API-URL an

const GroupsPage: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lädt Gruppen des aktuellen Nutzers
  const fetchGroups = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/api/groups?user_id=${encodeURIComponent(userId)}`
      );
      if (!res.ok) throw new Error("Failed to fetch groups");
      const json = await res.json();
      setGroups(json);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchGroups();
    }
  }, [userId, fetchGroups]);

  // Neue Gruppe erstellen
  const handleCreateGroup = async (name: string, category: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          avatar_url: "https://example.com/avatar.jpg",
          auth0_sub: userId,
        }),
      });
      if (!res.ok) throw new Error("Error creating group");

      const group = await res.json();

      const inviteRes = await fetch(
        `${API_BASE}/api/groups/${group.id}/invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!inviteRes.ok) throw new Error("Error fetching invite link");

      const data = await inviteRes.json();
      await fetchGroups();

      return { group: { id: group.id }, inviteLink: data.invite_link };
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create group");
      return { group: { id: -1 }, inviteLink: "" };
    }
  };

  // Gruppe öffnen
  const handleGroupClick = (groupId: number) => {
    router.push(`/`);
    // router.push(`/groups/${groupId}`);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>My Groups</Text>

        {groups.length === 0 ? (
          <Text style={styles.noGroups}>No groups found</Text>
        ) : (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.groupButton}
                onPress={() => handleGroupClick(item.id)}
              >
                <Text style={styles.groupName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.list}
          />
        )}

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setDialogOpen(true)}
        >
          <Text style={styles.createButtonText}>Create Group</Text>
        </TouchableOpacity>

        {/* Dialog (Modal) */}
        <GroupsDialog
          dialogState={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onCreateGroup={handleCreateGroup}
          viewGroup={handleGroupClick}
        />
      </View>
    </View>
  );
};

export default GroupsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  card: {
    width: 350,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  noGroups: { textAlign: "center", color: "#666", marginBottom: 16 },
  list: { gap: 8 },
  groupButton: { backgroundColor: "#fff", padding: 12, borderRadius: 10 },
  groupName: { fontSize: 16, color: "#222" },
  createButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  createButtonText: { color: "#fff", fontWeight: "600", textAlign: "center" },
});
