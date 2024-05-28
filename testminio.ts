import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { minioClient } from '@/utils/minio-client';
import formidable from 'formidable';

// bucketExists
// async function testminio(req: NextApiRequest, res: NextApiResponse) {
//   const generalBucket = process.env.MINIO_GENERAL_BUCKET || "";
//   const exist = await minioClient.bucketExists(generalBucket);
//   return res.status(200).json({ exist });
// }

// listBuckets
// async function testminio(res: NextApiResponse) {
//   const buckets = await minioClient.listBuckets()
//   return res.status(200).json({ buckets });
// }

// putObject
async function testminio(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method not allowed'});
  }
  const form = formidable({ multiples: true });
  let fields: any, files: any;

  try{
    [fields, files] = await form.parse(req);
    // console.log('files',files);
    const firstFile = files.file[0];
    // console.log('firstFile',firstFile);
    if(!firstFile || !firstFile.filepath){
      return res.status(400).json({message: 'No file uploaded'});
    }
    const generalBucket = process.env.MINIO_GENERAL_BUCKET || "";

    await minioClient.putObject(generalBucket, firstFile.originalFilename, fs.readFileSync(firstFile.filepath), firstFile.size, function (err: any, objInfo: any) {
      if (err) {
          return console.log(err) // err should be null
        }
      console.log('Success', objInfo)
    })

    return res.status(200).json({ message: 'File uploaded' });
  } catch (error) {
    console.log(error);
  }
}

//using next 13 route.ts
// import { writeFile } from 'fs/promises';
// import { join } from 'path';
// import { NextRequest, NextResponse } from 'next/server';

// async function testminio(req: NextRequest) {
//   const generalBucket = process.env.MINIO_GENERAL_BUCKET || "";
  
//   const data = await req.formData()
//   const file: File | null = data.get('file') as unknown as File;
  
//   if (!file) {
//     return NextResponse.json({ successs: false, message: 'No file uploaded' }, { status: 400 });
//   }

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   return NextResponse.json({ successs: true, message: 'File uploaded' }, { status: 200 });
// }
  
export const config = {
  api: {
    bodyParser: false,
  },
};

export default testminio;
