import { useEffect, useState } from 'react';
import { Pusher, PusherEvent, PusherMember } from '@pusher/pusher-websocket-react-native';

interface PusherOptions {
    apiKey: string;
    cluster: string;
    authEndpoint?: string;
    onConnectionStateChange?: (currentState: string, previousState: string) => void;
    onError?: (message: string, code: number, e: any) => void;
    onEvent?: (event: PusherEvent) => void;
    onSubscriptionSucceeded?: (channelName: string, data: any) => void;
    onSubscriptionError?: (channelName: string, message: string, e: any) => void;
    onDecryptionFailure?: (event: string, reason: string) => void;
    onSubscriptionCount?: (subscriptionCount: number) => void;
    onMemberAdded?: (channelName: string, member: PusherMember) => void;
    onMemberRemoved?: (channelName: string, member: PusherMember) => void;
}

const usePusher = (
    options: PusherOptions,
    channelName: string
): Pusher | null => {
    const [pusher, setPusher] = useState<Pusher | null>(null);

    useEffect(() => {
        const pusherInstance = Pusher.getInstance();

        const connectToPusher = async () => {
            try {
                await pusherInstance.init(options as any);
                await pusherInstance.connect();
                console.log('Connected to Pusher');
            } catch (e) {
                console.log(`ERROR: ${e}`);
            }
        };

        const subscribeToChannel = async () => {
            try {
                await pusherInstance.subscribe({
                    channelName,
                    onEvent: (event: PusherEvent) => {
                        options.onEvent?.(event);
                    },
                    onSubscriptionError: (
                        channelName: string,
                        message: string,
                        e: any
                    ) => {
                        options.onSubscriptionError?.(channelName, message, e);
                    },
                });
                console.log(`Subscribed to ${channelName}`);
            } catch (e) {
                console.log(`ERROR: ${e}`);
            }
        };

        connectToPusher();
        subscribeToChannel();

        setPusher(pusherInstance);

        return () => {
            pusherInstance.unsubscribe({ channelName });
            pusherInstance.disconnect();
        };
    }, [options.apiKey, options.cluster, options.authEndpoint, channelName]);

    return pusher;
};

export default usePusher;
