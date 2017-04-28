import React from "react";
import _ from "lodash";
import * as globals from "./globals";
import BarChart from "./barChart";
import closestPoint from "../util/closestPointOnPath";

const BarChartsForGroupVotes = ({
  selectedComment,
  allComments,
  groups,
  groupCornerAssignments,
  hullElems
}) => {

  const translations = {
    nw: [-40, 0],
    ne: [-40, 650],
    sw: [500, 10],
    se: [500, 650],
  };

  let cornerKeys = _.keys(groupCornerAssignments)
  function getCorner(gid) {
    for (let i = 0; i < cornerKeys.length; i++) {
      let key = cornerKeys[i];
      if (groupCornerAssignments[key].gid === gid) {
        return {
          corner: key,
          target: groupCornerAssignments[key].pos,
        };
      }
    }
    console.error('no corner');
    return null;
  }

  const drawBarChartsForGroupVotesOnSelectedComment = () => {
    let arr = []
    _.each(groups, (group, i) => {
      let {
        corner,
        target,
      } = getCorner(group.id);
      let translation = translations[corner];
      let yOffset = 0;
      if (corner === "nw" || corner === "sw") { /* WARNING! this is reversed for some reason, this should be ne not sw. */
        yOffset = 70;
      }
      // else if (corner === "sw" || corner === "se") {
      //   yOffset = -200;
      // }

      console.log("group path: ", hullElems[group.id])

      const closestPair = closestPoint(hullElems[group.id], [translation[0] + 100, translation[1] + yOffset])

      arr.push(
        <g key={group.id}>
          <line
            x1={translation[0] + 100}
            y1={translation[1] + yOffset}
            x2={closestPair[0]}
            y2={closestPair[1]}
            style={{
              stroke: "rgb(130,130,130)",
              strokeWidth:"1"
            }}/>
          <BarChart
            key={group.id}
            selectedComment={selectedComment}
            groupVotes={group /* hardcode first group for debug */}
            translate={"translate(" + translation[0] + "," + translation[1] + ")"}
            target={target}
            ptptCount={"ptptCount doesn't matter and isn't used because this barchart is for a group, not global"}/>
        </g>
      )
    })
    return arr;
  }

  return (
    <g transform="translate(0,10)">
      {selectedComment ? drawBarChartsForGroupVotesOnSelectedComment() : null}
    </g>
  )

}

export default BarChartsForGroupVotes;


// const allCommentsKeyed = _.keyBy(allComments, "tid");
// return groupComments.map((c, i) => {
//   if (!allCommentsKeyed[c.tid]) {
//     console.log('modded out?', c.tid);
//     return "";
//   }
//   // const groupVotes = math["group-votes"][gid].votes[comment.tid];
//   // const isBestAgree = comment["best-agree"] && (groupVotes && groupVotes.A > 0);
//   // const agree = isBestAgree || comment["repful-for"] === "agree";
//   // const percent = agree ?
//   // Math.floor(groupVotes.A / groupVotes.S * 100) :
//   // Math.floor(groupVotes.D / groupVotes.S * 100);

// })
