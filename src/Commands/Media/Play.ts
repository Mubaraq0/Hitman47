import { YT } from '../../lib'
import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs, YT_Search } from '../../Types'

@Command('play', {
    description: 'Plays a song of the given term from YouTube',
    cooldown: 15,
    exp: 35,
    category: 'media',
    usage: 'play [term]',
    aliases: ['aud']
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a term to play, Baka!')
        const term = context.trim()

        const videos = await this.client.utils.fetch<YT_Search[]>(`https://weeb-api.vercel.app/ytsearch?query=${term}`)
        if (!videos || !videos.length) return void M.reply(`No matching songs found | *"${term}"*`)
        const buffer = await new YT(videos[0].url, 'audio').download()

        const coolestMessages = [
            '*Get ready to groove! Here comes your song...*',
            '*Hold on tight, the beats are about to drop!*',
            '*Your jam is on its way, prepare to dance!*',
            '*Crank up the volume! Your song is here!*',
            '*Incoming vibes! Enjoy your tune...*'
        ]

        const randomMessage = coolestMessages[Math.floor(Math.random() * coolestMessages.length)]

        M.reply(randomMessage)

        return void (await M.reply(buffer, 'audio', undefined, 'audio/mpeg', undefined, undefined, {
            title: videos[0].title,
            thumbnail: await this.client.utils.getBuffer(videos[0].thumbnail),
            mediaType: 2,
            body: videos[0].description,
            mediaUrl: videos[0].url
        }))
    }
      }
          
