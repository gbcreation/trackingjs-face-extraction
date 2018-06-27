// Trackingjs modules are loaded in the window scope
require('tracking')
require('tracking/build/data/face')

// Add event listener to "change" event emitted by the <input type="file">
// element to load a local picture using the form input.
document.getElementById('browse').addEventListener(
    'change',
    handleFileSelect,
    false
)

document.getElementById('extract').addEventListener(
    'click',
    extractFaces,
    false
)

function handleFileSelect(event) {
    loadPicture(event.target.files[0])
}

// Setup the drag & drop event listeners
var dropZone = document.getElementById('dd-area')
dropZone.addEventListener('dragover', handleDragOver, false)
dropZone.addEventListener('dragleave', handleDragLeave, false)
dropZone.addEventListener('drop', handleFileDrop, false)

function handleDragOver(event) {
    event.stopPropagation()
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    event.target.classList.add('hover')
}

function handleDragLeave(event) {
    event.stopPropagation()
    event.preventDefault()
    event.target.classList.remove('hover')
}

function handleFileDrop(event) {
    event.stopPropagation()
    event.preventDefault()
    document.getElementById('extract').disabled = true
    document.getElementById('blur').disabled = true
    loadPicture(event.dataTransfer.files[0])
    event.target.classList.remove('hover')
}

function loadPicture(file) {
    if (file.type.match('image.*')) {
        const reader = new FileReader()
        reader.onload = function(event) {
            const img = document.createElement('img')
            img.onload = onPictureLoaded
            img.id = "picture"
            img.src = event.target.result
            const pictureContainer = document.getElementById('container')
            while (pictureContainer.childNodes.length) {
                pictureContainer.removeChild(pictureContainer.childNodes[0])
            }
            pictureContainer.appendChild(img)
            document.getElementById('faces').innerHTML = ""
        }
        reader.readAsDataURL(file)
    }
}

function onPictureLoaded(event) {
    document.getElementById('extract').disabled = false
    document.getElementById('blur').disabled = false
}

function extractFaces(event) {
    const picture = document.getElementById('picture')
    picture.style.opacity = 0.3

    document.getElementById('faces').innerHTML = ""

    const objectTracker = new tracking.ObjectTracker(['face'])
    objectTracker.on('track', function(event) {
        picture.style.opacity = 1
        if (event.data.length === 0) {
            console.log('No faces detected')
        } else {
            event.data.forEach(function(rect) {
                const div = document.createElement('div')
                div.style.backgroundImage = "url("+picture.src+")"
                div.style.backgroundPosition = -rect.x + "px " + (-rect.y) + "px"
                div.style.width = rect.width
                div.style.height = rect.height
                div.addEventListener('mouseover', onFaceMouseOver, false)
                div.addEventListener('mouseout', onFaceMouseOut, false)
                div.rect = rect
                document.getElementById('faces').appendChild(div)
            })
        }
    })
    tracking.track(picture, objectTracker)
}

function onFaceMouseOver(event) {
    const face = event.target
    const div = document.createElement('div')
    div.style.left = face.rect.x + 'px'
    div.style.top = face.rect.y + 'px'
    div.style.width = face.rect.width + 'px'
    div.style.height = face.rect.height + 'px'
    document.getElementById('container').appendChild(div)
}

function onFaceMouseOut() {
    const container = document.getElementById('container')
    container.removeChild(container.lastChild)
}

