import * as React from "react";
import { Button } from "antd";
import "./Report.css";

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [],
    };
  }

  fetchViolationTypes = async () => {
    await fetch("http://localhost:8080/case/getViolationType", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((types) => {
        this.setState({ types: types });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  fetchCountByStatus = (violationId, caseType) => {
    fetch(
      `http://localhost:8080/case/getCountOfStatus?status=inactive&violationId=${violationId}&caseType=${caseType}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((Response) => Response.json())
      .then((count) => {
        var tmpTypes = this.state.types;
        var tmp = {};
        for (let i = 0; i < tmpTypes.length; i++) {
          if (violationId === tmpTypes[i].violationId) {
            tmp = tmpTypes[i];
            if (caseType === "punishment") {
              tmp.approved = count.count;
            } else if (caseType === "rejected") {
              tmp.rejected = count.count;
            }
            tmpTypes[i] = tmp;
            this.setState({ types: tmpTypes });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = async () => {
    await this.fetchViolationTypes();
    const types = this.state.types;
    types.forEach((type) => {
      this.fetchCountByStatus(type.violationId, "punishment");
      this.fetchCountByStatus(type.violationId, "rejected");
    });
    console.log("types", this.state.types);
  };

  render() {
    return (
      <div className="report-container">
        {this.state.types.map((type) => (
          <div key={type.violationId} className="card">
            <h3>{type.name}</h3>
            <div>
              There {type.approved > 1 ? "are" : "is"} {type.approved} approved{" "}
              {type.approved > 1 ? "cases" : "case"} but not trained yet.
            </div>
            <div style={{ marginTop: "6px" }}>
              There {type.approved > 1 ? "are" : "is"} {type.rejected} rejected{" "}
              {type.approved > 1 ? "cases" : "case"} but not trained yet.
            </div>
            <Button
              type="primary"
              style={{ marginTop: "12px" }}
              disabled={true}
            >
              Train All
            </Button>
          </div>
        ))}
      </div>
    );
  }
}

export default Report;
