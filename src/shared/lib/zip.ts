import JSZip from "jszip";

export class DownloadZipFile {
  private readonly zip: JSZip
  private readonly zipName: string

  constructor(zipName: string) {
    this.zip = new JSZip();
    this.zipName = zipName;
  }

  public async addFile(filename: string, content: Uint8Array | string) { 
    this.zip.file(filename, content);
  }

  public async download() {
    const content = await this.zip.generateAsync({ type: 'blob' })
    const blobUrl = URL.createObjectURL(content)

    const link = document.createElement('a')

    link.href = blobUrl
    link.download = this.zipName

    document.body.appendChild(link)

    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    )

    document.body.removeChild(link)

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl)
    }, 40000)
  }
}
