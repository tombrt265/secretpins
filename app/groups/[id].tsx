import { supabase } from "@/utils/supabaseClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

// Android Animation Fix
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Member {
  id: string;
  role: "admin" | "member";
  profiles: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

interface Group {
  id: string;
  name: string;
  category: string;
  avatar_url: string;
  created_at: string;
}

export default function GroupOverview() {
  const router = useRouter();
  const { id, group } = useLocalSearchParams();
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersOpen, setMembersOpen] = useState(false);

  const fetchGroupMembers = useCallback(async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-group-members",
        {
          body: { gid: id },
        }
      );
      if (error) throw error;
      setMembers(JSON.parse(data));
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch group members");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchGroupMembers();
  }, [id, fetchGroupMembers]);

  useEffect(() => {
    if (group) {
      setCurrentGroup(JSON.parse(group as string));
      console.log("currentGroup.created_at", currentGroup?.created_at);
    }
  }, [group]);

  const handleGenerateInvite = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-invite", {
        body: { group_id: id },
      });
      if (error) throw error;

      const res = JSON.parse(data);
      Alert.alert("New Invite Code", `Invite Token: ${res.invite_token}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to generate new invite");
    }
  };

  const handleLeaveGroup = async () => {
    Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase
              .from("group_members")
              .delete()
              .eq("group_id", id);
            if (error) throw error;
            router.back();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to leave group");
          }
        },
      },
    ]);
  };

  const toggleMembers = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMembersOpen(!membersOpen);
  };

  if (loading || !currentGroup) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              currentGroup.avatar_url ||
              "https://www.gravatar.com/avatar/?d=mp",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{currentGroup.name}</Text>
        <Text style={styles.category}>{currentGroup.category}</Text>
        <Text style={styles.date}>
          Created on {new Date(currentGroup.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* INVITE BUTTON */}
      <TouchableOpacity
        style={styles.inviteButton}
        onPress={handleGenerateInvite}
      >
        <Text style={styles.inviteButtonText}>Generate New Invite Code</Text>
      </TouchableOpacity>

      {/* MEMBERS SECTION */}
      <TouchableOpacity onPress={toggleMembers} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Members {membersOpen ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {membersOpen && (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.memberItem}>
              <Image
                source={{
                  uri:
                    item.profiles.avatar_url ||
                    "https://www.gravatar.com/avatar/?d=mp",
                }}
                style={styles.memberAvatar}
              />
              <Text style={styles.memberName}>{item.profiles.username}</Text>
            </View>
          )}
          style={styles.memberList}
        />
      )}

      {/* STATISTICS SECTION */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Stat 1</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Stat 2</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Stat 3</Text>
        </View>
      </View>

      {/* LEAVE BUTTON */}
      <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
        <Text style={styles.leaveButtonText}>Leave Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  category: {
    fontSize: 16,
    color: "#666",
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  inviteButton: {
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  inviteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  memberList: {
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    color: "#333",
  },
  statsSection: {
    marginTop: 10,
    gap: 10,
  },
  statCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statTitle: {
    fontWeight: "500",
    color: "#444",
  },
  leaveButton: {
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  leaveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
