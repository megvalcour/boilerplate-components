<script>
import { cloneVNode } from 'vue'

/**
 * Default selector used for all focusable elements.
 */
const FOCUSABLE_SELECTOR = [
    'a[href]',
    'audio[controls]',
    'button',
    'details summary',
    'input',
    'map area[href]',
    'select',
    'svg a[xlink\\:href]',
    '[tabindex]',
    'textarea',
    'video[controls]',
].map(t => t + ':not([tabindex^="-"]):not([disabled])').join()

/**
 * Default key filters. These should be functions that 'filter out' what
 * elements should be considered when a key is hit.
 */
const KEY_FILTERS = {
    ArrowRight: elements => elements.filter(({ x, top, bottom }) => x > 0 && top < 0 && bottom > 0),
    ArrowLeft: elements => elements.filter(({ x, top, bottom }) => x < 0 && top < 0 && bottom > 0),
    ArrowDown: elements => elements.filter(({ y, left, right }) => y > 0 && left < 0 && right > 0),
    ArrowUp: elements => elements.filter(({ y, left, right }) => y < 0 && left < 0 && right > 0),
    Home: elements => elements.length && elements.slice(0, 1),
    End: elements => elements.length && elements.slice(-1),
}

export default {
    setup (_, { attrs, slots }) {
        let elements = null
        /**
         * Method for retrieving all currently visible, focusable elements.
         */
        function queryFocusableElements () {
            return elements
                .map(({ el }) => Array.from(el.querySelectorAll(FOCUSABLE_SELECTOR)))
                .flat()
        }

        /**
         * Retrieves where the element is drawn on screen (client rects).
         * Adds in x and y for the center of the element.
         */
        function getElementRects (el) {
            const rects = el.getClientRects()[0]

            if (!rects) {
                return null
            }

            return {
                bottom: rects.bottom,
                height: rects.height,
                left: rects.left,
                right: rects.right,
                top: rects.top,
                width: rects.width,
                x: rects.left + rects.width / 2,
                y: rects.top + rects.height / 2,
            }
        }

        /**
         * Calls getElementRects for every element in nodeList, and adjust the
         * values to be relative to origin for simpler follow up math. Also
         * calculates the distance between the two elements' centers.
         */
        function augmentElementRects (nodeList, origin) {
            const elements = []
            origin = getElementRects(origin)

            if (!origin) {
                return elements
            }

            nodeList.forEach(el => {
                const rects = getElementRects(el)
                if (rects === null) {
                    return
                }

                rects.bottom -= origin.y
                rects.left -= origin.x
                rects.right -= origin.x
                rects.top -= origin.y
                rects.x -= origin.x
                rects.y -= origin.y

                const distance = Math.sqrt(rects.x * rects.x + rects.y * rects.y)

                elements.push({ el, ...rects, distance })
            })

            return elements
        }

        /**
         * Returns the filter function for key, or a function that always returns false.
         */
        function filterForKey (key) {
            return key in KEY_FILTERS ? KEY_FILTERS[key] : null
        }

        /**
         * returns the closest, focusable element to el that passes the filter
         * function key.
         */
        function findTarget (el, key) {
            const elements = augmentElementRects(queryFocusableElements(), el)
            const keyFilter = filterForKey(key)
            if (elements.length && keyFilter) {
                return keyFilter(elements)
                    .reduce((closest, n) => n.distance < closest.distance ? n : closest, { distance: Infinity })
                    .el
            }
            return null
        }

        /**
         * Event handler; tries to find an element to move to; if it does,
         * changes focus, otherwise just lets teh event bubble up.
         */
        function handler (evt) {
            const newTarget = findTarget(evt.target, evt.key)
            if (newTarget) {
                evt.preventDefault()
                evt.stopPropagation()
                newTarget.focus()
            }
        }

        elements = slots.default()
            .map(vnode => cloneVNode(vnode, {
                attrs,
                onKeydown: handler,
            }))

        return () => elements
    },
}
</script>
