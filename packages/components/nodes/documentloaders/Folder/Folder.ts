import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { TextSplitter } from 'langchain/text_splitter'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'

class Folder_DocumentLoaders implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Folder with Files'
        this.name = 'folderFiles'
        this.type = 'Document'
        this.icon = 'folder.svg'
        this.category = 'Document Loaders'
        this.description = `Load data from folder with multiple files`
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Folder Path',
                name: 'folderPath',
                type: 'string',
                placeholder: ''
            },
            {
                label: 'Text Splitter',
                name: 'textSplitter',
                type: 'TextSplitter',
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const textSplitter = nodeData.inputs?.textSplitter as TextSplitter
        const folderPath = nodeData.inputs?.folderPath as string

        const loader = new DirectoryLoader(folderPath, {
            '.json': (path) => new JSONLoader(path),
            '.txt': (path) => new TextLoader(path),
            '.csv': (path) => new CSVLoader(path),
            '.docx': (path) => new DocxLoader(path),
            // @ts-ignore
            '.pdf': (path) => new PDFLoader(path, { pdfjs: () => import('pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js') })
        })

        if (textSplitter) {
            const docs = await loader.loadAndSplit(textSplitter)
            return docs
        } else {
            const docs = await loader.load()
            return docs
        }
    }
}

module.exports = { nodeClass: Folder_DocumentLoaders }
