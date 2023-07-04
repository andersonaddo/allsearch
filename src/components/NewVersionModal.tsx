import { useDisclosure } from "@chakra-ui/react";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { fetchNewBackgroundImage, getBackgroundImageInfoOneShot, setUserDefinedBackgroundViaURL } from "../utils/backgroundProvider";
import { recordNewVersionModalShown, shouldShowNewVersionModal } from "../utils/onboardingManager";
import { getSessionAggregationInfo } from "../utils/storage";
import { appendUrlToProxyServerUrl } from "../utils/utils";

const NewVersionModal: React.FC = () => {
    const { isOpen, onOpen: setModalOpen, onClose: setModalClose } = useDisclosure()

    //Transform data (like in localstorage) if needed
    const transformDataIfNecessary = useCallback(() => {
        const sessionInfo = getSessionAggregationInfo();
        if (sessionInfo.currentVersion !== sessionInfo.versionInLastSession) {
            const backgroundInfo = getBackgroundImageInfoOneShot()

            //In v3 -> v4 we changed the signature of the BackgroundInfo type a bit
            if (backgroundInfo && sessionInfo.versionInLastSession === 3) {
                if (backgroundInfo.isUserDefined) {
                    setUserDefinedBackgroundViaURL(backgroundInfo.url, appendUrlToProxyServerUrl(backgroundInfo.url))
                } else {
                    fetchNewBackgroundImage(true)
                }
            }

        }
    }, []);

    useEffect(() => {
        const shouldOpen = shouldShowNewVersionModal()
        if (shouldOpen) {
            recordNewVersionModalShown()
            transformDataIfNecessary()
            setModalOpen()
        }
    }, [setModalOpen, transformDataIfNecessary])

    return null; //You can uncomment the stuff below if you actually want to render something.

    // return (
    //     <Modal isOpen={isOpen} onClose={setModalClose} size="4xl">
    //         <ModalOverlay
    //             bg='blackAlpha.300'
    //             backdropFilter='blur(10px) hue-rotate(20deg)'
    //         />
    //         <ModalContent>
    //             <ModalHeader>
    //                 Allsearch just got better!
    //             </ModalHeader>

    //             <ModalCloseButton />

    //             <ModalBody>
    //                 This is a test
    //             </ModalBody>
    //         </ModalContent>
    //     </Modal >
    // )
}

export default React.memo(NewVersionModal)
