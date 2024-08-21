import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import Suggesteduser from "./Suggesteduser";

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const showToast = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users/suggested");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setSuggestedUsers(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        getSuggestedUsers();
    }, [showToast]);
    return (
        <>{suggestedUsers.length!==0 && (<>
            <Text mb={4} fontWeight={"bold"}>
                Suggested Users
            </Text>
            <Flex direction={{ base: "row", md: "column" }} gap={4} overflowX="auto">
                {!loading && suggestedUsers.map((user) => <Suggesteduser key={user._id} user={user} />)}
                {loading &&
                    [0, 1, 2, 3, 4].map((_, idx) => (
                        <Flex
                            key={idx}
                            gap={2}
                            alignItems={"center"}
                            p={"1"}
                            borderRadius={"md"}
                        >
                            {/* Avatar */}
                            <Box>
                                <SkeletonCircle size={"10"} />
                            </Box>
                            {/* Username and fullname */}
                            <Flex w={"full"} flexDirection={"column"} gap={2}>
                                <Skeleton h={"8px"} w={"80px"} />
                                <Skeleton h={"8px"} w={"90px"} />
                            </Flex>
                            {/* Follow Button */}
                            <Flex>
                                <Skeleton h={"20px"} w={"60px"} />
                            </Flex>
                        </Flex>
                    ))}
            </Flex>
        </>)}

        </>
    );
};

export default SuggestedUsers;

// < Box >
// <SkeletonCircle size={"10"} />
//                     </Box >
// {/* Username and fullname */ }
// < Flex w = { "full"} flexDirection = { "column"} gap = { 2} >
//                         <Skeleton h={"8px"} w={"80px"} />
//                         <Skeleton h={"8px"} w={"90px"} />
//                     </Flex >
// {/* Follow Button */ }
// < Flex >
// <Skeleton h={"20px"} w={"60px"} />
//                     </Flex >
//                 </Flex >