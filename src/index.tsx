import React, { useEffect } from 'react'
import {
  DeviceEventEmitter,
  findNodeHandle,
  NativeModules,
  Platform,
  requireNativeComponent,
  ViewStyle } from 'react-native'

const RNPdfScanner = requireNativeComponent('RNPdfScanner')
const ScannerManager: any = NativeModules.RNPdfScannerManager

export interface PictureTaken {
  rectangleCoordinates?: object;
  croppedImage: string;
  initialImage: string;
  width: number;
  height: number;
}

/**
 * TODO: Change to something like this
interface PictureTaken {
  uri: string;
  base64?: string;
  width?: number; // modify to get it
  height?: number; // modify to get it
  rectangleCoordinates?: object;
  initial: {
    uri: string;
    base64?: string;
    width: number; // modify to get it
    height: number; // modify to get it
  };
}
 */

interface PdfScannerProps {
  onPictureTaken?: (event: any) => void;
  onRectangleDetect?: (event: any) => void;
  onProcessing?: () => void;
  quality?: number;
  overlayColor?: number | string;
  enableTorch?: boolean;
  useFrontCam?: boolean;
  saturation?: number;
  brightness?: number;
  contrast?: number;
  detectionCountBeforeCapture?: number;
  durationBetweenCaptures?: number;
  detectionRefreshRateInMS?: number;
  documentAnimation?: boolean;
  noGrayScale?: boolean;
  manualOnly?: boolean;
  style?: ViewStyle;
  useBase64?: boolean;
  saveInAppDocument?: boolean;
  captureMultiple?: boolean;
  navigation?: any;
}

function PdfScanner (props: PdfScannerProps) {

  const sendOnPictureTakenEvent =(event: any)=> {
    if (!props.onPictureTaken) return null
    return props.onPictureTaken(event.nativeEvent)
  }

  const sendOnRectangleDetectEvent =(event: any)=> {
    if (!props.onRectangleDetect) return null
    return props.onRectangleDetect(event.nativeEvent)
  }

  const getImageQuality =()=> {
    if (!props.quality) return 0.8
    if (props.quality > 1) return 1
    if (props.quality < 0.1) return 0.1
    return props.quality
  }

  useEffect(()=>{
    if (Platform.OS === 'android') {
      const { onPictureTaken, onProcessing } = props
      if (onPictureTaken) {
        var subscriptionPicture = DeviceEventEmitter.addListener('onPictureTaken', onPictureTaken)
      }
      if (onProcessing) {
        var subscriptionProcess= DeviceEventEmitter.addListener('onProcessingChange', onProcessing)}
    }
    return ()=>{
      if (Platform.OS === 'android') {
        const { onPictureTaken, onProcessing } = props
        if (onPictureTaken) subscriptionPicture.removeListener('onPictureTaken', onPictureTaken)
        if (onProcessing) subscriptionProcess.removeListener('onProcessingChange', onProcessing)
      }
    }
  },[props.onPictureTaken, props.onProcessing])

  // componentDidMount () {
  //   if (Platform.OS === 'android') {
  //     const { onPictureTaken, onProcessing } = this.props
  //     if (onPictureTaken) {
  //       onPictureTakenListener = DeviceEventEmitter.addListener('onPictureTaken', onPictureTaken)
  //     }
  //     if (onProcessing) DeviceEventEmitter.addListener('onProcessingChange', onProcessing)
  //   }
  // }

  // componentDidUpdate(prevProps: PdfScannerProps) {
  //   if (Platform.OS === 'android') {
  //     if (this.props.onPictureTaken !== prevProps.onPictureTaken) {
  //       if (prevProps.onPictureTaken)
  //         DeviceEventEmitter.removeListener('onPictureTaken', prevProps.onPictureTaken)
  //       if (this.props.onPictureTaken)
  //         DeviceEventEmitter.addListener('onPictureTaken', this.props.onPictureTaken)
  //     }
  //     if (this.props.onProcessing !== prevProps.onProcessing) {
  //       if (prevProps.onProcessing)
  //         DeviceEventEmitter.removeListener('onProcessingChange', prevProps.onProcessing)
  //       if (this.props.onProcessing)
  //         DeviceEventEmitter.addListener('onProcessingChange', this.props.onProcessing)
  //     }
  //   }
  // }

  // componentWillUnmount () {
  //   if (Platform.OS === 'android') {
  //     const { onPictureTaken, onProcessing } = this.props
  //     if (onPictureTaken) DeviceEventEmitter.removeListener('onPictureTaken', onPictureTaken)
  //     if (onProcessing) DeviceEventEmitter.removeListener('onProcessingChange', onProcessing)
  //   }
  // }

  const capture =()=> {
    if (_scannerHandle) {
      ScannerManager.capture(_scannerHandle)
    }
  }

  let _scannerRef: any = null;
  let _scannerHandle: number | null = null;
  let _setReference = (ref: any) => {
    if (ref) {
      _scannerRef = ref
      _scannerHandle = findNodeHandle(ref)
    } else {
      _scannerRef = null
      _scannerHandle = null
    }
  };

  
    return (
      <RNPdfScanner
        ref={_setReference}
        {...props}
        onPictureTaken={(event: any)=>sendOnPictureTakenEvent(event)}
        onRectangleDetect={(event: any)=>sendOnRectangleDetectEvent(event)}
        useFrontCam={props.useFrontCam || false}
        brightness={props.brightness || 0}
        saturation={props.saturation || 1}
        contrast={props.contrast || 1}
        quality={()=>getImageQuality()}
        detectionCountBeforeCapture={props.detectionCountBeforeCapture || 5}
        durationBetweenCaptures={props.durationBetweenCaptures || 0}
        detectionRefreshRateInMS={props.detectionRefreshRateInMS || 50}
      />
    )
}

export default React.memo(PdfScanner)
