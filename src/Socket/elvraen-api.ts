import { proto } from '../../WAProto/index.js'
import type { WABusinessProfile } from '../Types'
import type { LabelActionBody } from '../Types/Label.js'
import type { QuickReplyAction } from '../Types/Bussines.js'
import type { AnyMessageContent, ChatModification, LastMessageList, MiscMessageGenerationOptions, WAMessage, WAMessageKey } from '../Types'

type ElvraenSocket = {
	sendMessage: (
		jid: string,
		content: AnyMessageContent,
		options?: MiscMessageGenerationOptions
	) => Promise<unknown>
	star: (
		jid: string,
		messages: { id: string; fromMe?: boolean }[],
		star: boolean
	) => Promise<unknown>
	readMessages: (keys: WAMessageKey[]) => Promise<unknown>
	chatModify: (mod: ChatModification, jid: string) => Promise<unknown>
	onWhatsApp: (...phoneNumbers: string[]) => Promise<
		{ jid: string; exists: boolean }[] | undefined
	>
        profilePictureUrl: (
                jid: string,
                type?: 'preview' | 'image',
                timeoutMs?: number
        ) => Promise<string | undefined>
        fetchStatus: (...jids: string[]) => Promise<unknown>
        fetchBlocklist: () => Promise<(string | undefined)[]>
        updateProfileStatus: (status: string) => Promise<void>
        updateProfileName: (name: string) => Promise<void>
        getBusinessProfile: (jid: string) => Promise<WABusinessProfile | void>
        addOrEditContact: (jid: string, contact: proto.SyncActionValue.IContactAction) => Promise<unknown>
        removeContact: (jid: string) => Promise<unknown>
        addLabel: (jid: string, labels: LabelActionBody) => Promise<unknown>
        addChatLabel: (jid: string, labelId: string) => Promise<unknown>
        removeChatLabel: (jid: string, labelId: string) => Promise<unknown>
        addMessageLabel: (jid: string, messageId: string, labelId: string) => Promise<unknown>
        removeMessageLabel: (jid: string, messageId: string, labelId: string) => Promise<unknown>
        addOrEditQuickReply: (quickReply: QuickReplyAction) => Promise<unknown>
        removeQuickReply: (timestamp: string) => Promise<unknown>

}

export const attachElvraenAPI = <T extends ElvraenSocket>(sock: T) => {
	return Object.assign(sock, {
		elvraen: {
			checkWhatsApp: async (...phoneNumbers: string[]) =>
				sock.onWhatsApp(...phoneNumbers),

			getProfilePicture: async (
				jid: string,
				type: 'preview' | 'image' = 'preview',
				timeoutMs?: number
			) => sock.profilePictureUrl(jid, type, timeoutMs),

			getStatus: async (...jids: string[]) =>
				sock.fetchStatus(...jids),

			getBlocklist: async () => sock.fetchBlocklist(),

			updateProfileStatus: async (status: string) =>
				sock.updateProfileStatus(status),

			updateProfileName: async (name: string) =>
				sock.updateProfileName(name),

			getBusinessProfile: async (jid: string) =>
				sock.getBusinessProfile(jid),

			addOrEditContact: async (jid: string, contact: proto.SyncActionValue.IContactAction) =>
				sock.addOrEditContact(jid, contact),

			removeContact: async (jid: string) =>
				sock.removeContact(jid),

			addLabel: async (jid: string, labels: LabelActionBody) =>
				sock.addLabel(jid, labels),

			addChatLabel: async (jid: string, labelId: string) =>
				sock.addChatLabel(jid, labelId),

			removeChatLabel: async (jid: string, labelId: string) =>
				sock.removeChatLabel(jid, labelId),

			addMessageLabel: async (jid: string, messageId: string, labelId: string) =>
				sock.addMessageLabel(jid, messageId, labelId),
			removeMessageLabel: async (jid: string, messageId: string, labelId: string) =>
				sock.removeMessageLabel(jid, messageId, labelId),

			addOrEditQuickReply: async (quickReply: QuickReplyAction) =>
				sock.addOrEditQuickReply(quickReply),

			removeQuickReply: async (timestamp: string) =>
				sock.removeQuickReply(timestamp),

			sendText: async (
				jid: string,
				text: string,
				options: MiscMessageGenerationOptions = {}
			) => sock.sendMessage(jid, { text }, options),

			sendAudio: async (
				jid: string,
				audio: Extract<AnyMessageContent, { audio: any }>['audio'],
				ptt = false,
				options: MiscMessageGenerationOptions = {}
			) => sock.sendMessage(jid, { audio, ptt }, options),

			sendVideo: async (
				jid: string,
				video: Extract<AnyMessageContent, { video: any }>['video'],
				caption?: string,
				options: MiscMessageGenerationOptions = {}
			) => sock.sendMessage(jid, { video, caption }, options),

			sendDocument: async (
				jid: string,
				document: Extract<AnyMessageContent, { document: any }>['document'],
				mimetype: string,
				fileName?: string,
				options: MiscMessageGenerationOptions = {}
			) =>
				sock.sendMessage(
					jid,
					{ document, mimetype, ...(fileName ? { fileName } : {}) },
					options
				),

			sendImage: async (
				jid: string,
				image: Extract<AnyMessageContent, { image: any }>['image'],
				caption?: string,
				options: MiscMessageGenerationOptions = {}
			) => sock.sendMessage(jid, { image, caption }, options),

			sendSticker: async (
				jid: string,
				sticker: Extract<AnyMessageContent, { sticker: any }>['sticker'],
				options: MiscMessageGenerationOptions = {}
			) => sock.sendMessage(jid, { sticker }, options),

			sendLocation: async (
				jid: string,
				latitude: number,
				longitude: number,
				name?: string,
				address?: string,
				options: MiscMessageGenerationOptions = {}
			) =>
				sock.sendMessage(
					jid,
					{
						location: {
							degreesLatitude: latitude,
							degreesLongitude: longitude,
							...(name ? { name } : {}),
							...(address ? { address } : {}),
						},
					},
					options
				),

			sendList: async (
			jid: string,
			title: string,
			description: string,
			buttonText: string,
			sections: proto.Message.ListMessage.ISection[],
			footerText?: string,
			options: MiscMessageGenerationOptions = {}
		) =>
				sock.sendMessage(
					jid,
					{
						list: {
							title,
							description,
							buttonText,
							listType: proto.Message.ListMessage.ListType.SINGLE_SELECT,
							sections,
							...(footerText ? { footerText } : {}),
						},
					},
					options
				),

		sendButtons: async (
			jid: string,
			contentText: string,
			buttons: proto.Message.ButtonsMessage.IButton[],
			footerText?: string,
			options: MiscMessageGenerationOptions = {}
		) =>
				sock.sendMessage(
					jid,
					{
						buttons: {
							contentText,
							...(footerText ? { footerText } : {}),
							headerType: proto.Message.ButtonsMessage.HeaderType.TEXT,
							buttons,
						},
					},
					options
				),

		sendCTA: async (
			jid: string,
			bodyText: string,
			buttonName: string,
			buttonParamsJson: string,
			headerTitle?: string,
			footerText?: string,
			options: MiscMessageGenerationOptions = {}
		) =>
			sock.sendMessage(
				jid,
				{
					interactiveMessage: {
						body: { text: bodyText },
						...(headerTitle ? { header: { title: headerTitle } } : {}),
						...(footerText ? { footer: { text: footerText } } : {}),
						nativeFlowMessage: {
							buttons: [{ name: buttonName, buttonParamsJson }],
						},
					},
				},
				options
			),

		sendCarousel: async (
			jid: string,
			cards: proto.Message.IInteractiveMessage[],
			messageVersion: number = 1,
			carouselCardType: proto.Message.InteractiveMessage.CarouselMessage.CarouselCardType = proto.Message.InteractiveMessage.CarouselMessage.CarouselCardType.HSCROLL_CARDS,
			options: MiscMessageGenerationOptions = {}
		) =>
			sock.sendMessage(
				jid,
				{
					interactiveMessage: {
						carouselMessage: {
							cards,
							messageVersion,
							carouselCardType,
						},
					},
				},
				options
			),

		sendTemplate: async (
			jid: string,
			contentText: string,
			buttons: proto.IHydratedTemplateButton[],
			footerText?: string,
			titleText?: string,
			templateId?: string,
			options: MiscMessageGenerationOptions = {}
		) =>
			sock.sendMessage(
				jid,
				{
					templateMessage: {
						hydratedFourRowTemplate: {
							hydratedContentText: contentText,
							...(footerText ? { hydratedFooterText: footerText } : {}),
							...(titleText ? { hydratedTitleText: titleText } : {}),
							...(templateId ? { templateId } : {}),
							hydratedButtons: buttons,
						},
					},
				},
				options
			),

		sendInteractive: async (
			jid: string,
			bodyText: string,
			buttons: proto.Message.InteractiveMessage.NativeFlowMessage.INativeFlowButton[],
			headerTitle?: string,
			headerSubtitle?: string,
			footerText?: string,
			options: MiscMessageGenerationOptions = {}
		) =>
			sock.sendMessage(
				jid,
				{
					interactiveMessage: {
						body: { text: bodyText },
						...(headerTitle || headerSubtitle ? { header: { ...(headerTitle ? { title: headerTitle } : {}), ...(headerSubtitle ? { subtitle: headerSubtitle } : {}) } } : {}),
						...(footerText ? { footer: { text: footerText } } : {}),
						nativeFlowMessage: { buttons },
					},
				},
				options
			),

		sendNativeFlow: async (
			jid: string,
			contentText: string,
			buttons: proto.Message.ButtonsMessage.IButton[],
			footerText?: string,
			options: MiscMessageGenerationOptions = {}
		) =>
			sock.sendMessage(
				jid,
				{
					buttons: {
					contentText,
					...(footerText ? { footerText } : {}),
					headerType: proto.Message.ButtonsMessage.HeaderType.TEXT,
					buttons: buttons.map(button => ({
						...button,
						type: proto.Message.ButtonsMessage.Button.Type.NATIVE_FLOW,
					}))
					},
				},
				options
			),

		sendButtonReply: async (
			jid: string,
			buttonId: string,
			displayText: string,
			options: MiscMessageGenerationOptions = {}
		) =>
			sock.sendMessage(
				jid,
				{
					buttonReply: {
						id: buttonId,
						displayText,
						index: 0,
					},
					type: 'plain',
				},
				options
			),

		sendListReply: async (
			jid: string,
			rowId: string,
			displayText: string,
			description?: string,
			options: MiscMessageGenerationOptions = {}
		) =>
			sock.sendMessage(
				jid,
				{
					listReply: {
						title: displayText,
						description,
						singleSelectReply: {
							selectedRowId: rowId,
						},
					},
				},
				options
			),

		sendContact: async (
				jid: string,
				displayName: string,
				vcard: string,
				options: MiscMessageGenerationOptions = {}
			) =>
				sock.sendMessage(
					jid,
					{
						contacts: {
							displayName,
							contacts: [{ vcard }],
						},
					},
					options
				),

			sendReaction: async (
				jid: string,
				key: WAMessageKey,
				text: string,
				options: MiscMessageGenerationOptions = {}
			) =>
				sock.sendMessage(
					jid,
					{ react: { text, key } },
					options
				),

			sendPoll: async (
				jid: string,
				name: string,
				values: string[],
				selectableCount = 1,
				options: MiscMessageGenerationOptions = {}
			) =>
				sock.sendMessage(
					jid,
					{
						poll: {
							name,
							values,
							selectableCount,
						},
					},
					options
				),

			sendPin: async (
				jid: string,
				key: WAMessageKey,
				type: proto.PinInChat.Type,
				time?: 86400 | 604800 | 2592000,
				options: MiscMessageGenerationOptions = {}
			) =>
				sock.sendMessage(
					jid,
					{
						pin: key,
						type,
						...(time !== undefined ? { time } : {}),
					},
					options
				),

			sendDelete: async (
				jid: string,
				key: WAMessageKey,
				options: MiscMessageGenerationOptions = {}
			) =>
				sock.sendMessage(
					jid,
					{ delete: key },
					options
				),

			sendForward: async (
				jid: string,
				message: WAMessage,
				force = false,
				options: MiscMessageGenerationOptions = {}
			) =>
				sock.sendMessage(
					jid,
					{ forward: message, force },
					options
				),

			sendReply: async (
				jid: string,
				text: string,
				quoted: WAMessage,
				options: MiscMessageGenerationOptions = {}
			) =>
				sock.sendMessage(
					jid,
					{ text },
					{ ...options, quoted }
				),

			editMessage: async (
				jid: string,
				key: WAMessageKey,
				content: AnyMessageContent,
				options: MiscMessageGenerationOptions = {}
			) =>
				sock.sendMessage(
					jid,
					{ ...content, edit: key },
					options
				),

		readMessages: async (keys: WAMessageKey[]) => sock.readMessages(keys),
		sendStatus: async (
			content: AnyMessageContent,
			options: MiscMessageGenerationOptions = {}
		) => sock.sendMessage('status@broadcast', content, options),


		archiveChat: async (jid: string, lastMessages: LastMessageList) =>
			sock.chatModify({ archive: true, lastMessages }, jid),

		unarchiveChat: async (jid: string, lastMessages: LastMessageList) =>
			sock.chatModify({ archive: false, lastMessages }, jid),

		markChatUnread: async (jid: string, lastMessages: LastMessageList) =>
			sock.chatModify({ markRead: false, lastMessages }, jid),


		starMessage: async (
			jid: string,
			key: { id: string; fromMe?: boolean }
		) => sock.star(jid, [key], true),

		unstarMessage: async (
			jid: string,
			key: { id: string; fromMe?: boolean }
		) => sock.star(jid, [key], false),

		},
	})
}
