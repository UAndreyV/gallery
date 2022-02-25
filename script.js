document.addEventListener("DOMContentLoaded", () => {

    function gallery() {
        function galleryInit(container, containerImage, image, heightRow, margin) {
            const rowheight = heightRow;
            const guttersizer = margin;
            const grid = document.querySelector(container);
            const itemGrid = grid.querySelectorAll(containerImage);
            const itemImage = grid.querySelectorAll(image);

            initMasonry(grid, rowheight, guttersizer, itemGrid, itemImage);

            setTimeout(() => {
                window.addEventListener('resize', () => {
                    initMasonry(grid, rowheight, guttersizer, itemGrid, itemImage);
                });
            }, 500);

        }

        function initMasonry(grid, rowheight, guttersizer, itemGrid, itemImage) {
            const containerWidth = grid.clientWidth;
            const imageWidths = getImageWidths(rowheight, itemImage);
            const rows = divideRows(imageWidths, containerWidth);
            let heights = [];
            fitItemsByWidth(rows, heights, containerWidth, rowheight, guttersizer);
            updateItems(rows, heights, guttersizer, itemGrid);
            updateGridHeight(grid, heights, guttersizer);
        }

        function getImageWidths(rowheight, itemImage) {
            let imageWidths = [];
            itemImage.forEach(element => {
                imageWidths.push(element.naturalWidth * rowheight / element.naturalHeight);

            });
            return imageWidths;
        }

        function divideRows(imageWidths, containerWidth) {
            let rows = [];
            let curRow = 0;
            let rowWidth = 0;
            imageWidths.forEach(item => {
                rowWidth += item;
                if (typeof rows[curRow] == 'undefined') {
                    rows[curRow] = [];
                }
                rows[curRow].push(item);
                if (rowWidth >= containerWidth) {
                    curRow += 1;
                    rowWidth = 0;
                }

            });
            return rows;
        }

        function fitItemsByWidth(rows, heights, containerWidth, heightSizer, gutterSizer) {
            rows.forEach(row => {
                let sumWidth = 0;
                let thresholdRatio = 1.5;
                let rowWidth = containerWidth - gutterSizer * (row.length - 1);
                row.forEach(width => {
                    sumWidth += width;
                });
                let ratio = rowWidth / sumWidth;
                if (ratio < thresholdRatio) {
                    row.forEach((width, curRow) => {
                        width *= ratio;
                        row[curRow] = width;
                    });
                    heights.push(heightSizer * ratio);
                } else {
                    heights.push(heightSizer);
                }
                sumWidth = 0;
                row.forEach(width => {
                    sumWidth += width;
                });
            });
        }

        function updateItems(rows, heights, guttersizer, itemGrid) {
            let curRow = 0;
            let curCol = 0;
            let top = 0;
            let left = 0;
            let width = 0;
            let height = 0;
            itemGrid.forEach(item => {
                if (curCol >= rows[curRow].length) {
                    top += heights[curRow];
                    curRow++;
                    curCol = 0;
                    if (curRow !== 0) {
                        top += guttersizer;
                    }
                    left = 0;
                }
                left += rows[curRow][curCol - 1] ? rows[curRow][curCol - 1] + guttersizer : 0;
                width = rows[curRow][curCol];
                height = heights[curRow];
                item.style.cssText = `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px; `;
                curCol++;
            });
        }

        function updateGridHeight(grid, heights, guttersizer) {
            let sumHeight = heights.reduce((cur, acc) => {
                return cur + acc + guttersizer;
            }, 0);
            sumHeight -= guttersizer;
            grid.style.cssText = `height: ${sumHeight}px`;
        }
        galleryInit('.portfolio__images', '.portfolio__image', '.portfolio__image img', 350, 10);
    }

    gallery();


});



