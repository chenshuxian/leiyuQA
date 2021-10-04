import fs from 'fs'
import path from 'path'
export function getAllQAIds() {
    const fileNames = fs.readdirSync(postsDirectory)
  
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map(fileName => {
      return {
        params: {
          examType: fileName.replace(/\.md$/, '')
        }
      }
    })
  }

//   export function getQAData(id) {
//     // const fullPath = path.join(postsDirectory, `${id}.md`)
//     // const fileContents = fs.readFileSync(fullPath, 'utf8')
//     const names = ['人文','']
  
//     // Use gray-matter to parse the post metadata section
//     // const matterResult = matter(fileContents)
  
//     // Combine the data with the id
//     return {
//       id,
//       ...matterResult.data
//     }
//   }