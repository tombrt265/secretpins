import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GroupsDialog from "../../components/groups-dialog";
import { supabase } from "../../utils/supabaseClient";

interface Group {
  id: number;
  name: string;
  category: string;
  avatar_url: string;
}

export default function GroupsPage() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const uid = auth?.user?.id || null;

  const [groups, setGroups] = useState<Group[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    if (!uid) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("get-groups");
      if (error) {
        console.error("Error fetching groups:", error);
        throw new Error(error.message);
      }
      setGroups(JSON.parse(data));
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    if (uid) {
      fetchGroups();
    }
  }, [uid, fetchGroups]);

  const handleCreateGroup = async (name: string, category: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("create-group", {
        body: { name, category, avatar_url: null },
      });

      if (error) {
        console.error("Error fetching groups:", error);
        throw new Error(error.message);
      }

      const res = await JSON.parse(data);
      const groupId = res.id;
      const invite_link = res.invite_token;

      return { groupId: groupId as number, inviteLink: invite_link as string };
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create group");
      return { groupId: -1, inviteLink: "" };
    }
  };

  const handleGroupClick = (groupId: number) => {
    router.push({
      pathname: `/groups/[id]`,
      params: {
        id: groupId.toString(),
        group: JSON.stringify(groups.find((g) => g.id === groupId)),
      },
    });
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

        {groups?.length ? (
          <FlatList
            data={groups || []}
            keyExtractor={(item, index) =>
              item?.id?.toString() ?? index.toString()
            }
            renderItem={({ item }) =>
              item ? (
                <TouchableOpacity style={styles.groupButton}>
                  <Image
                    source={{
                      uri:
                        item.avatar_url ||
                        "https://www.gravatar.com/avatar/?d=mp",
                    }}
                    style={styles.memberAvatar}
                  />
                  <Text
                    style={styles.groupName}
                    onPress={() => handleGroupClick(item.id)}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ) : null
            }
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text style={styles.noGroups}>No groups found</Text>
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
          onClose={() => (setDialogOpen(false), fetchGroups())}
          onCreateGroup={handleCreateGroup}
          viewGroup={handleGroupClick}
        />
      </View>
    </View>
  );
}

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
  groupButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },
  groupName: { fontSize: 16, color: "#222" },
  createButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  createButtonText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});
