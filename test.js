import test from 'ava'
import extractCloudinaryDataSpec from './tests/extractCloudinaryData.spec'
import imageSpec from './tests/Image.spec'

extractCloudinaryDataSpec(test)
imageSpec(test)
