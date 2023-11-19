import { YT } from '../../lib'
import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs, YT_Search } from '../../Types'

@Command('song', {
    description: 'Plays a song of the given term from YouTube',
    cooldown: 15,
    exp: 35,
    aliases: ['song', 'download', 'music'],
    category: 'chatbot',
    usage: 'song [term]'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a term to play, Baka!')
        const term = context.trim()
        M.reply('🎧...Downloading...🎧')
        const videos = await this.client.utils.fetch<YT_Search[]>(`https://weeb-api.vercel.app/ytsearch?query=${term}`)
        if (!videos || !videos.length) return void M.reply(`No matching songs found | *"${term}"*`)
        const buffer = await new YT(videos[0].url, 'audio').download()
        return void (await M.reply(buffer, 'audio', undefined, 'audio/mpeg', undefined, undefined, {
            title: videos[0].title,
            thumbnail: await this.client.utils.getBuffer(videos[0].thumbnail),
            mediaType: 2,
            body: videos[0].description,
            mediaUrl: videos[0].url
        }))
    }
 }

