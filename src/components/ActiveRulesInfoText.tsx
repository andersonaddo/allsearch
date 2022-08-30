import { HStack, Link } from "@chakra-ui/react";
import * as React from "react";
import { FaCogs } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getActiveRules } from "../utils/storage";

const ActiveRulesInfoText: React.FC = () => {

    const [activeRuleCount, setActiveRuleCount] = React.useState(0)
    const navigate = useNavigate();


    React.useEffect(() => {
        const rules = getActiveRules()
        let activeRuleCount = 0;
        for (const entry of Object.values(rules)) activeRuleCount += Object.keys(entry).length
        setActiveRuleCount(activeRuleCount)
    }, [])

    return (
        <HStack>
            {activeRuleCount <= 0 ? null :
                <>
                    <FaCogs />
                    <Link onClick={() => navigate("./settings?index=3")}>
                        {activeRuleCount} active rule{activeRuleCount > 1 ? "s" : ""}
                    </Link>
                </>
            }
        </HStack>

    )
}

export default React.memo(ActiveRulesInfoText)
