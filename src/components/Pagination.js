import React from "react";
import PropTypes from "prop-types";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */

const range = (from, to, step = 1) => {
  let i = from;
  const rangeArr = [];

  while (i <= to) {
    rangeArr.push(i);
    i += step;
  }

  return rangeArr;
};

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    const { pageNeighbours = 3 } = props;

    // pageNeighbours can be: 0, 1 or 2
    this.pageNeighbours =
      typeof pageNeighbours === "number"
        ? Math.max(0, Math.min(pageNeighbours, 3))
        : 0;
  }

  handleClick = (page) => (evt) => {
    evt.preventDefault();
    this.props.goToPage(page);
  };

  handleMoveLeft = (evt) => {
    evt.preventDefault();
    const page = this.props.currentPage - this.pageNeighbours * 2 + 1;
    this.props.goToPage(page);
  };

  handleMoveRight = (evt) => {
    evt.preventDefault();
    const page = this.props.currentPage + this.pageNeighbours * 2 - 3;
    this.props.goToPage(page);
  };

  /**
   * Let's say we have 10 pages and we set pageNeighbours to 2
   * Given that the current page is 6
   * The pagination control will look like the following:
   *
   * (1) < {4 5} [6] {7 8} > (10)
   *
   * (x) => terminal pages: first and last page(always visible)
   * [x] => represents current page
   * {...x} => represents page neighbours
   */
  fetchPageNumbers = () => {
    // const totalPages = this.props.totalPages;
    // const currentPage = this.props.currentPage;
    const { totalPages, currentPage } = this.props;
    const { pageNeighbours } = this;

    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = this.pageNeighbours + 1;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages = range(startPage, endPage);

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  };

  render() {
    const { currentPage } = this.props;
    const pages = this.fetchPageNumbers();

    return (
      <ul className="pagination" style={{ height: 35 }}>
        {pages.map((page) => {
          if (page === LEFT_PAGE || page === RIGHT_PAGE)
            return (
              <li key={page}>
                <a
                  className="page-link"
                  href="#"
                  onClick={
                    page === LEFT_PAGE
                      ? this.handleMoveLeft
                      : this.handleMoveRight
                  }
                >
                  <span aria-hidden="true">...</span>
                </a>
              </li>
            );

          return (
            <li
              key={page}
              className={`${currentPage === page ? "active" : ""}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={this.handleClick(+page - 1)}
              >
                {page}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

Pagination.propTypes = {
  pageNeighbours: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  goToPage: PropTypes.func.isRequired,
};
