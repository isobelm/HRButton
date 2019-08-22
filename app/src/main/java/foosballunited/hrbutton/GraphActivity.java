package foosballunited.hrbutton;

import android.graphics.Color;
import android.support.v7.app.ActionBar;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.MenuItem;
//import android.view.View;
//import android.widget.Button;

import com.jjoe64.graphview.GraphView;
import com.jjoe64.graphview.series.DataPoint;
import com.jjoe64.graphview.series.LineGraphSeries;

import foosbalunited.hrbutton.R;

public class GraphActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.graph_activity);

        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayHomeAsUpEnabled(true);

        DataPoint[] data = new DataPoint[MainActivity.DAYS_IN_MONTH];
        int[] monthlyCounts = MainActivity.monthlyCounts;
        for (int i = 0; i < monthlyCounts.length; i++)
        {
            data[i] = new DataPoint(i, monthlyCounts[i]);
        }

        GraphView graph = findViewById(R.id.graph);
        LineGraphSeries<DataPoint> series = new LineGraphSeries(data);
        series.setColor(0xFFDD6D63);
        graph.addSeries(series);
        graph.getGridLabelRenderer().setPadding(0);
        graph.getGridLabelRenderer().setHorizontalLabelsVisible(false);
        graph.getGridLabelRenderer().setVerticalLabelsVisible(false);
        graph.getViewport().setXAxisBoundsManual(true);
        graph.getViewport().setMinX(0);
        graph.getViewport().setMaxX(MainActivity.TODAY);
        graph.getGridLabelRenderer().setGridColor(0xFF7F7F7F);
//        graph.set(true);
        graph.setBackgroundColor(Color.argb(255, 52, 52, 52));
//        graph.getGridLabelRenderer().set(0x7F7F7F);
    }

    public boolean onOptionsItemSelected(MenuItem item){
        Intent myIntent = new Intent(getApplicationContext(), MainActivity.class);
        startActivityForResult(myIntent, 0);
        return true;
    }
}
