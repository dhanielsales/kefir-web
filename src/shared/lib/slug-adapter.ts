import slug, { Options } from 'slug'

export class SlugAdapter {
  private readonly options: Options

  constructor (options?: Options) {
    this.options = {
      replacement: ' ',
      lower: false,
      locale: 'pt',
      symbols: false,
      ...options
    }

    // Added new charmaps to replace simbols to words
    slug.extend({
      '+': '+',
      '(': '(',
      ')': ')',
      '-': '-',
      _: '_',
      ',': ',',
      '.': '.',
      º: 'o',
      ª: 'a'
    })
  }

  sanitize (value: string): string {
    const decodedString = Buffer.from(value).toString('utf-8')

    const slugified = slug(decodedString, this.options)

    return slugified
  }
}
